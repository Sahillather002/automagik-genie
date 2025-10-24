"use strict";
/**
 * Create Subtask Tool - Create child task under master orchestrator
 *
 * Allows master orchestrators to delegate work as subtasks.
 * Subtasks have parent relationship and can be used for complex work breakdown.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubtaskToolSchema = void 0;
exports.executeCreateSubtaskTool = executeCreateSubtaskTool;
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
// Load ForgeClient
const geniePackageRoot = path_1.default.resolve(__dirname, '../../../..');
const ForgeClient = require(path_1.default.join(geniePackageRoot, 'forge.js')).ForgeClient;
const FORGE_URL = process.env.FORGE_BASE_URL || 'http://localhost:8887';
const DEFAULT_PROJECT_ID = 'ee8f0a72-44da-411d-a23e-f2c6529b62ce'; // Genie project ID
/**
 * Create subtask parameters
 */
exports.createSubtaskToolSchema = zod_1.z.object({
    parent_attempt_id: zod_1.z.string().describe('Parent task attempt ID (the master orchestrator)'),
    title: zod_1.z.string().describe('Subtask title'),
    prompt: zod_1.z.string().describe('Subtask prompt/description'),
    executor: zod_1.z.string().optional().default('CLAUDE_CODE:DEFAULT').describe('Executor variant (e.g., "CLAUDE_CODE:wish", "CLAUDE_CODE:DEFAULT")')
});
/**
 * Create subtask execution
 */
async function executeCreateSubtaskTool(args, context) {
    const { streamContent } = context;
    let fullOutput = `📦 Creating subtask under parent: ${args.parent_attempt_id}\n\n`;
    await streamContent({
        type: 'text',
        text: fullOutput
    });
    const forgeClient = new ForgeClient(FORGE_URL);
    try {
        const result = await forgeClient.createAndStartTask({
            project_id: DEFAULT_PROJECT_ID,
            title: args.title,
            prompt: args.prompt,
            executor: args.executor,
            parent_task_attempt: args.parent_attempt_id
        });
        const taskId = result.task_id || 'unknown';
        const attemptId = result.attempt_id || 'unknown';
        const url = `${FORGE_URL}/projects/${DEFAULT_PROJECT_ID}/tasks/${taskId}/attempts/${attemptId}?view=diffs`;
        const successMsg = `✅ Subtask created successfully\n\n` +
            `📋 Title: ${args.title}\n` +
            `🔗 URL: ${url}\n` +
            `🆔 Task ID: ${taskId}\n` +
            `🔄 Attempt ID: ${attemptId}\n\n` +
            `💡 Subtask will execute in background as child of master orchestrator.\n`;
        fullOutput += successMsg;
        await streamContent({
            type: 'text',
            text: successMsg
        });
        return fullOutput;
    }
    catch (error) {
        const errorMsg = `❌ Failed to create subtask: ${error.message}\n`;
        fullOutput += errorMsg;
        await streamContent({
            type: 'text',
            text: errorMsg
        });
        return fullOutput;
    }
}

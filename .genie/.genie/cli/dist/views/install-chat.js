"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInstallChat = runInstallChat;
const prompts_1 = __importDefault(require("prompts"));
const gradient_string_1 = __importDefault(require("gradient-string"));
async function runInstallChat(options) {
    console.log('\n' + gradient_string_1.default.cristal(`🧞 Install Agent (${options.template})`) + '\n');
    console.log('Starting install agent...\n');
    try {
        // Start MCP session with install agent
        const result = await options.mcpClient.run({
            agent: options.agent,
            prompt: `Initialize ${options.template} template. Guide the user through setup.`,
            name: `install-${options.template}-${Date.now()}`
        });
        const sessionId = result.sessionId;
        console.log(`🤖 Agent: ${result.response || 'Hello! I\'m the install agent. Let me help you set up Genie.'}\n`);
        // Interactive chat loop
        let isDone = false;
        while (!isDone) {
            const { userInput } = await (0, prompts_1.default)({
                type: 'text',
                name: 'userInput',
                message: '👤 You:',
            }, {
                onCancel: () => {
                    console.log('\n❌ Cancelled');
                    process.exit(0);
                }
            });
            if (!userInput || !userInput.trim())
                continue;
            console.log('\n⏳ Agent is thinking...\n');
            try {
                const result = await options.mcpClient.resume({
                    sessionId,
                    prompt: userInput
                });
                console.log(`🤖 Agent: ${result.response || ''}\n`);
                // Check if agent signals completion
                if (result.status === 'completed' || result.response?.includes('[INSTALL_COMPLETE]')) {
                    console.log('✅ Installation complete!\n');
                    isDone = true;
                }
            }
            catch (error) {
                console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}\n`);
            }
        }
    }
    catch (error) {
        console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}\n`);
        throw error;
    }
}

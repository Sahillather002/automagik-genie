"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logViewer = __importStar(require("./codex-log-viewer"));
const CODEX_PACKAGE_SPEC = '@namastexlabs/codex@0.43.0-alpha.5';
const defaults = {
    binary: 'npx',
    packageSpec: CODEX_PACKAGE_SPEC,
    sessionsDir: path_1.default.join(process.env.HOME || process.env.USERPROFILE || '~', '.codex', 'sessions'),
    exec: {
        fullAuto: true,
        model: 'gpt-5-codex',
        sandbox: 'workspace-write',
        approvalPolicy: 'on-failure',
        profile: null,
        includePlanTool: false,
        search: false,
        skipGitRepoCheck: false,
        json: false,
        experimentalJson: true,
        color: 'auto',
        cd: null,
        outputSchema: null,
        outputLastMessage: null,
        reasoningEffort: 'low',
        additionalArgs: [],
        images: []
    },
    resume: {
        includePlanTool: false,
        search: false,
        last: false,
        additionalArgs: []
    },
    sessionExtractionDelayMs: null
};
function buildRunCommand({ config = {}, instructions, prompt, agentPath }) {
    const execConfig = mergeExecConfig(config.exec);
    const command = config.binary || defaults.binary;
    const packageSpec = config.packageSpec || defaults.packageSpec;
    const args = [];
    if (packageSpec) {
        if (command === 'npx') {
            args.push('-y', String(packageSpec));
        }
        else {
            args.push(String(packageSpec));
        }
    }
    args.push('exec', ...collectExecOptions(execConfig));
    if (agentPath) {
        const instructionsFile = path_1.default.isAbsolute(agentPath) ? agentPath : path_1.default.resolve(agentPath);
        const escapedInstructionsFile = instructionsFile.replace(/"/g, '\\"');
        args.push('-c', `append_user_instructions_file="${escapedInstructionsFile}"`);
    }
    if (prompt) {
        args.push(prompt);
    }
    return { command, args };
}
function buildResumeCommand({ config = {}, sessionId, prompt }) {
    const resumeConfig = mergeResumeConfig(config.resume);
    const command = config.binary || defaults.binary;
    const packageSpec = config.packageSpec || defaults.packageSpec;
    const args = [];
    if (packageSpec) {
        if (command === 'npx') {
            args.push('-y', String(packageSpec));
        }
        else {
            args.push(String(packageSpec));
        }
    }
    args.push('exec', 'resume');
    if (resumeConfig.includePlanTool)
        args.push('--include-plan-tool');
    if (resumeConfig.search)
        args.push('--search');
    if (Array.isArray(resumeConfig.additionalArgs)) {
        resumeConfig.additionalArgs.forEach((arg) => {
            if (typeof arg === 'string')
                args.push(arg);
        });
    }
    if (sessionId) {
        args.push(sessionId);
    }
    else if (resumeConfig.last) {
        args.push('--last');
    }
    if (prompt) {
        args.push(prompt);
    }
    return { command, args };
}
function resolvePaths({ config = {}, baseDir, resolvePath }) {
    const sessionsDirRaw = config.sessionsDir || defaults.sessionsDir;
    const sessionsDir = resolvePath ? resolvePath(sessionsDirRaw, baseDir) : sessionsDirRaw;
    return {
        sessionsDir
    };
}
function extractSessionId({ startTime, paths = {} }) {
    const sessionsDir = paths.sessionsDir;
    if (!sessionsDir)
        return null;
    const date = new Date(startTime ?? 0);
    if (Number.isNaN(date.getTime()))
        return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayDir = path_1.default.join(sessionsDir, String(year), month, day);
    if (!fs_1.default.existsSync(dayDir))
        return null;
    const files = fs_1.default
        .readdirSync(dayDir)
        .filter((file) => file.startsWith('rollout-') && file.endsWith('.jsonl'))
        .map((file) => {
        const fullPath = path_1.default.join(dayDir, file);
        const stat = fs_1.default.statSync(fullPath);
        return { name: file, path: fullPath, mtime: stat.mtimeMs };
    })
        .sort((a, b) => b.mtime - a.mtime);
    for (const file of files) {
        if (Math.abs(file.mtime - (startTime ?? 0)) < 60000) {
            const match = file.name.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
            if (match)
                return match[1];
        }
    }
    return null;
}
function getSessionExtractionDelay({ config = {}, defaultDelay }) {
    if (typeof config.sessionExtractionDelayMs === 'number') {
        return config.sessionExtractionDelayMs;
    }
    return defaultDelay;
}
function locateSessionFile({ sessionId, startTime, sessionsDir }) {
    if (!sessionId || !sessionsDir)
        return null;
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime()))
        return null;
    // Helper to check a specific date directory
    const checkDirectory = (targetDate) => {
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const dayDir = path_1.default.join(sessionsDir, String(year), month, day);
        if (!fs_1.default.existsSync(dayDir))
            return null;
        // Try exact match first
        const exactPattern = new RegExp(`rollout-.*-${sessionId}\\.jsonl$`, 'i');
        const files = fs_1.default.readdirSync(dayDir);
        for (const file of files) {
            if (exactPattern.test(file)) {
                return path_1.default.join(dayDir, file);
            }
        }
        // Fuzzy matching with ±5min window
        const fuzzyFiles = files
            .filter((file) => file.startsWith('rollout-') && file.endsWith('.jsonl'))
            .map((file) => {
            const fullPath = path_1.default.join(dayDir, file);
            const stat = fs_1.default.statSync(fullPath);
            return { name: file, path: fullPath, mtime: stat.mtimeMs };
        })
            .filter((file) => Math.abs(file.mtime - startTime) < 300000);
        for (const file of fuzzyFiles) {
            const match = file.name.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
            if (match && match[1].toLowerCase() === sessionId.toLowerCase()) {
                return file.path;
            }
        }
        return null;
    };
    // Try the date from startTime first
    let result = checkDirectory(date);
    if (result)
        return result;
    // Try yesterday (in case of timezone differences)
    const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    result = checkDirectory(yesterday);
    if (result)
        return result;
    // Try tomorrow (in case of timezone differences)
    const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    return checkDirectory(tomorrow);
}
function mergeExecConfig(execConfig = {}) {
    return {
        ...defaults.exec,
        ...execConfig,
        additionalArgs: Array.isArray(execConfig.additionalArgs)
            ? execConfig.additionalArgs.slice()
            : defaults.exec.additionalArgs.slice(),
        images: Array.isArray(execConfig.images)
            ? execConfig.images.slice()
            : defaults.exec.images.slice()
    };
}
function mergeResumeConfig(resume = {}) {
    return {
        ...defaults.resume,
        ...resume,
        additionalArgs: Array.isArray(resume.additionalArgs)
            ? resume.additionalArgs.slice()
            : defaults.resume.additionalArgs.slice()
    };
}
function collectExecOptions(execConfig) {
    const options = [];
    if (execConfig.fullAuto)
        options.push('--full-auto');
    if (execConfig.model)
        options.push('-m', String(execConfig.model));
    if (execConfig.sandbox)
        options.push('-s', String(execConfig.sandbox));
    if (execConfig.approvalPolicy)
        options.push('-c', `approval-policy="${execConfig.approvalPolicy}"`);
    if (execConfig.profile)
        options.push('-p', String(execConfig.profile));
    if (execConfig.includePlanTool)
        options.push('--include-plan-tool');
    if (execConfig.search)
        options.push('--search');
    if (execConfig.skipGitRepoCheck)
        options.push('--skip-git-repo-check');
    if (execConfig.experimentalJson)
        options.push('--experimental-json');
    else if (execConfig.json)
        options.push('--json');
    if (execConfig.color && execConfig.color !== 'auto')
        options.push('--color', String(execConfig.color));
    if (execConfig.cd)
        options.push('-C', String(execConfig.cd));
    if (execConfig.outputSchema)
        options.push('--output-schema', String(execConfig.outputSchema));
    if (execConfig.outputLastMessage)
        options.push('--output-last-message', String(execConfig.outputLastMessage));
    if (execConfig.reasoningEffort) {
        options.push('-c', `reasoning.effort="${execConfig.reasoningEffort}"`);
    }
    if (Array.isArray(execConfig.images)) {
        execConfig.images.forEach((imagePath) => {
            if (typeof imagePath === 'string' && imagePath.length) {
                options.push('-i', imagePath);
            }
        });
    }
    if (Array.isArray(execConfig.additionalArgs)) {
        execConfig.additionalArgs.forEach((arg) => {
            if (typeof arg === 'string')
                options.push(arg);
        });
    }
    return options;
}
/**
 * Attempt to locate session file by session ID alone
 * Searches ~/.codex/sessions/ directory tree for matching files
 * Used for orphaned session recovery when sessions.json is missing entries
 */
function tryLocateSessionFileBySessionId(sessionId, sessionsDir) {
    if (!sessionId || !sessionsDir || !fs_1.default.existsSync(sessionsDir)) {
        return null;
    }
    // Search pattern: look in recent date directories (today, yesterday, day before)
    const now = new Date();
    const searchDates = [0, -1, -2].map(offset => {
        const d = new Date(now);
        d.setDate(d.getDate() + offset);
        return d;
    });
    for (const date of searchDates) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayDir = path_1.default.join(sessionsDir, String(year), month, day);
        if (!fs_1.default.existsSync(dayDir))
            continue;
        const files = fs_1.default.readdirSync(dayDir);
        const pattern = new RegExp(`-${sessionId}\\.jsonl$`, 'i');
        for (const file of files) {
            if (pattern.test(file)) {
                return path_1.default.join(dayDir, file);
            }
        }
    }
    return null;
}
const codexExecutor = {
    defaults,
    buildRunCommand,
    buildResumeCommand,
    resolvePaths,
    extractSessionId,
    getSessionExtractionDelay,
    locateSessionFile,
    tryLocateSessionFileBySessionId,
    logViewer
};
exports.default = codexExecutor;

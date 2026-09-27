#!/usr/bin/node
import os from "os";
import { resolve as resolvePath } from "path";
import { exec } from "child_process";
import { copyFileSync, existsSync, mkdirSync } from "fs";

const profileDirName = "RDM-debugging";
const profileFiles = { "browser_prefs.js": "user.js" };
const linuxProfileDir = [".mozilla", "firefox"];
const winProfileDir = ["Mozilla", "Firefox", "Profiles"];

function err(code, ...msg){
    console.error(...msg);
    process.exit(code);
}

async function getProfileDir(){
    switch(os.type().toUpperCase()){
        case "LINUX":
            if(os.release().toUpperCase().match("MICROSOFT|WSL")){  // is WSL, target Windows host
                let appData = await new Promise(resolve => exec('wslpath $(cmd.exe /C "echo %AppData%" 2>/dev/null)', (err, stdout, stderr) => {    // get Linux path to host Windows AppData dir
                    if(stderr || err) err(2, "Unable to get Windows host AppData path:", stderr);
                    else resolve(stdout.trim());
                }));
                return resolvePath(appData, ...winProfileDir);
            }else return resolvePath(os.homedir(), ...linuxProfileDir);
        case "WINDOWS_NT": return resolvePath(process.env.APPDATA, ...winProfileDir);
        default: err(1, "Unsupported OS:", os.type());
    }
}

console.log("Locating profile dir...");
const profilesDir = await getProfileDir();
if(existsSync(profilesDir)) console.log("Profile dir located:", profilesDir);
else err(3, "Profile dir missing (aborting):", profilesDir);

const profileDir = resolvePath(profilesDir, profileDirName);
if(existsSync(profileDir)) console.log("Profile already exists, skipping initialization.");
else{
    console.log("Creating profile...");
    mkdirSync(profileDir);
    if(Object.entries(profileFiles).map(([fromFilename, toFilename]) => {
        if(!fromFilename) return false;
        if(!profileDir) err(5, "Profile dir not initialized!");
        let fromUserJS = resolvePath(import.meta.dirname, fromFilename);
        if(!existsSync(fromUserJS)) err(4, "File missing, cannot copy (aborting):", fromFilename);
        copyFileSync(fromUserJS, resolvePath(profileDir, toFilename));
        return true;
    }).every(c => !c)) err(6, "No files configured to copy!");
}
console.log("Profile ready:", profileDirName);

process.exit();
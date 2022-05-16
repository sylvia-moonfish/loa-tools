import * as crypto from "crypto";
import * as fs from "fs";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import * as path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

export function generateRandomString(byteLength: number) {
  return crypto.randomBytes(byteLength).toString("hex");
}

export function parseDOM(content: string) {
  return new JSDOM(content);
}

export function fileExists(_path: string) {
  try {
    if (fs.existsSync(_path)) {
      return true;
    }
  } catch {}

  return false;
}

export function createDirectory(_path: string) {
  fs.mkdir(path.dirname(_path), { recursive: true }, () => {});
}

export async function downloadFile(url: string, _path: string) {
  if (!fileExists(_path)) {
    const streamPipeline = promisify(pipeline);
    const response = await fetch(url, { method: "GET" });

    if (response.ok) {
      createDirectory(_path);
      await streamPipeline(response.body, fs.createWriteStream(_path));
    }
  }
}

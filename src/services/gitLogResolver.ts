import * as child_process from 'child_process';
import * as os from 'os';

import { Commit } from '../models/commit';
import { Detail } from '../models/detail';

export function log(cwd: string, filePath: string = ''): Promise<Array<Commit>> {
    return getLog(cwd, filePath);
}

function getLog(cwd: string, filePath: string): Promise<Array<Commit>> {
    return new Promise((resolve, reject) => {
        child_process.exec(`git log --format="%h-=-%s-=-%an<%ae>-=-%ad" --date=iso ${filePath}`, {
            cwd: cwd,
            maxBuffer: 5000 * 1024
        }, (error, stdout, stderr) => {
            if (error) {
                const msgs = error.message.split('\n');
                const msg = msgs.length === 1 ? msgs[0] : msgs.filter(m => m).find(m => !m.startsWith('Command failed'));
                return reject(msg);
            }
            if (stderr) {
                return reject(stderr);
            }

            const commits: Array<Commit> = stdout
                .replace(/\r\n/mg, '\n')
                .split('\n')
                .filter(line => line)
                .map(line => {
                    const data = line.split('-=-');
                    return {
                        hash: data[0],
                        message: data[1],
                        author: data[2],
                        date: data[3]
                    };
                });

            resolve(commits);
        });
    });
}

export function detail(cwd: string, commit: string, filePath: string = ''): Promise<Detail> {
    return getDetail(cwd, commit, filePath);
}

function getDetail(cwd: string, commit: string, filePath: string = ''): Promise<Detail> {
    return new Promise((resolve, reject) => {
        child_process.exec(`git show --pretty="%b" ${commit} ${filePath}`, {
            cwd: cwd,
            maxBuffer: 5000 * 1024
        }, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }

            resolve({
                hash: commit,
                content: colorfullDetail(stdout)
            });
        });
    });
}

export function colorfullDetail(detail: string): string {
    return detail
        .replace(/\r\n/mg, '\n')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /mg, '&nbsp;')
        .replace(/(@@.+@@)/, m => `<span style="color: #00c6c7;">${m}</span>`)
        .replace(/^(-[^\n]*)/mg, m => `<span style="color: #ff2441;">${m.replace(/\n$/, '')}</span>\n`)
        .replace(/^(\+[^\n]*)/mg, m => `<span style="color: #00c02b;">${m.replace(/\n$/, '')}</span>\n`)
        .replace(/\n/mg, '<br/>');
}


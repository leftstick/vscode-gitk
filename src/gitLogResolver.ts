import * as child_process from 'child_process';
import * as os from 'os';

import { Commit } from './commit';

export function log(filePath: string, cwd: string): Promise<Array<Commit>> {

    return new Promise((resolve, reject) => {
        child_process.exec(`git log --format="%h-=-%s-=-%an<%ae>-=-%ad" --date=iso ${filePath}`, {
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }

            const commits: Array<Commit> = stdout
                .split(os.EOL)
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

export function detail(filePath: string, commit: string, cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        child_process.exec(`git show --pretty="%b" ${commit} ${filePath}`, {
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }

            resolve(stdout);
        });
    });
}

export function colorfullDetail(detail: string): string {
    return detail
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /mg, '&nbsp;')
        .replace(/(@@.+@@)/, m => `<span style="color: #00c6c7;">${m}</span>`)
        .replace(/^(-\s*.+)/mg, m => `<span style="color: #ca1a00;">${m.replace(/\n$/, '')}</span>\n`)
        .replace(/^(\+\s*.+)/mg, m => `<span style="color: #00c02b;">${m.replace(/\n$/, '')}</span>\n`)
        .replace(/\n/mg, '<br/>');
}


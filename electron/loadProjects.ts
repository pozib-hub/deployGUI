import * as _ from 'lodash'
import * as path from 'path'
import * as fs from 'fs'
import debug from 'debug'

import checkEmptyDir from './helpers/checkEmptyDir'

import * as util from 'util'
import * as child from 'child_process'

import * as config from '../projectsConfigs.json'

const exec = util.promisify(child.exec)
const mkdir = util.promisify(fs.mkdir)

const log = debug('LoadProjects:')

export default async function loadProjects() {
    const pathDirProjects = path.resolve('projects')
    await mkdir(pathDirProjects)

    return Promise.all(
        Object.keys(config).map(async (nameProject) => {
            // create dir for project
            await exec(`mkdir ${nameProject} `, { cwd: pathDirProjects })

            // @ts-ignore
            const pathToGit = config[nameProject]
            const pathToProject = path.join(pathDirProjects, nameProject)

            const isEmptyDir = await checkEmptyDir(pathToProject)

            if (isEmptyDir) {
                console.log(`clone ${nameProject} from git`)
                await exec(`git clone ${pathToGit} .`, { cwd: pathToProject })
                console.log('clone git done')

                console.log(`npm install ${nameProject}`)
                await exec('npm i --no-save', { cwd: pathToProject })
                console.log('npm install done')
            }
        })
    )
}

import { promises as fs } from 'fs'

export default async function checkEmptyDir(path: string) {
    try {
        const directory = await fs.opendir(path)
        const entry = await directory.read()
        await directory.close()

        return entry === null
    } catch (error) {
        return false
    }
}

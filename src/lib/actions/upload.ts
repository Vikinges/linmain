'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get('file') as File
        if (!file) {
            throw new Error('No file uploaded')
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueId = randomUUID()
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '') // Sanitize filename
        const filename = `${uniqueId}-${originalName}`

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Ignore error if directory exists
        }

        // Write file
        const path = join(uploadDir, filename)
        await writeFile(path, buffer)

        return { success: true, url: `/uploads/${filename}` }
    } catch (error) {
        console.error('Upload error:', error)
        return { success: false, error: 'Upload failed' }
    }
}

import axiosInstance from '@/utils/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream } from 'fs';
import IncomingForm from 'formidable/Formidable';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable bodyParser to handle FormData
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const form = new IncomingForm();

    form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
            console.error('Form Parsing Error:', err);
            return res.status(400).json({ message: 'Failed to parse form data' });
        }

        const file: any = files.file as formidable.File;

        try {
            // Forward the file to the external API
            const formData = new FormData();
            const fileStream = createReadStream(file.filepath);
            const chunks: Uint8Array[] = [];
            for await (const chunk of fileStream) {
                chunks.push(chunk);
            }
            const blob = new Blob(chunks, { type: file.mimetype });
            formData.append('file', blob, file.originalFilename);

            const response = await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Return the response from the external API to the client
            return res.status(200).json(response.data);
        } catch (error) {
            console.error('API Route Error:', error);
            return res.status(500).json({ message: 'Error uploading file', error });
        }
    });
}

import { deleteFromS3, uploadToS3 } from '@/lib/utils/s3-operations';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Handle file upload
        const { file, key } = req.body;
        const result = await uploadToS3(file, key);
        res.status(result.success ? 200 : 500).json(result);
    } else if (req.method === 'DELETE') {
        // Handle file deletion
        const { key } = req.body;
        const result = await deleteFromS3(key);
        res.status(result.success ? 200 : 500).json(result);
    } else {
        res.setHeader('Allow', ['POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth';
import { fetchLinkPreview } from '../services/linkPreview';
import { createLink, deleteLink, getLinks } from '../services/links';

const router = Router();

// Validation schemas
const previewRequestSchema = z.object({
  url: z.string().url('Invalid URL format')
});

const createLinkSchema = z.object({
  url: z.string().url('Invalid URL format'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long'),
  image: z.string().url().optional(),
  tags: z.array(z.string()).max(10, 'Too many tags')
});

const getLinksQuerySchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1)).default('1'),
  pageSize: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1).max(100)).default('20')
});

// POST /api/links/preview
router.post('/preview', async (req: Request, res: Response) => {
  try {
    const { url } = previewRequestSchema.parse(req.body);
    
    const preview = await fetchLinkPreview(url);
    res.json(preview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.errors[0].message,
        statusCode: 400
      });
      return;
    }

    console.error('Preview error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch preview',
      statusCode: 500
    });
  }
});

// POST /api/links (requires auth)
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const linkData = createLinkSchema.parse(req.body);
    const userId = req.user!.id;

    const link = await createLink(userId, linkData);
    res.status(201).json(link);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.errors[0].message,
        statusCode: 400
      });
      return;
    }

    console.error('Create link error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to create link',
      statusCode: 500
    });
  }
});

// GET /api/links (requires auth)
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { search, tag, page, pageSize } = getLinksQuerySchema.parse(req.query);
    const userId = req.user!.id;

    const links = await getLinks(userId, page, pageSize, search, tag);
    res.json(links);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        message: error.errors[0].message,
        statusCode: 400
      });
      return;
    }

    console.error('Get links error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch links',
      statusCode: 500
    });
  }
});

// DELETE /api/links/:id (requires auth)
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await deleteLink(userId, id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to delete link',
      statusCode: 500
    });
  }
});

export default router;

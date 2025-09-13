import { eq, sql } from 'drizzle-orm';
import { db, schema } from '../db';
import { generateShortCode, isValidUrl, isValidShortCode } from '../utils/url';
import { randomUUID } from 'crypto';
import type { Url, NewUrl } from '../db/schema';

export class UrlService {
  /**
   * Cria uma nova URL encurtada
   */
  async createUrl(originalUrl: string, customShortCode?: string): Promise<Url> {
    if (!isValidUrl(originalUrl)) {
      throw new Error('URL inválida');
    }

    let shortCode: string;

    if (customShortCode) {
      if (!isValidShortCode(customShortCode)) {
        throw new Error('Código curto mal formatado');
      }
      
      // Verifica se o código customizado já existe
      const existing = await this.getUrlByShortCode(customShortCode);
      if (existing) {
        throw new Error('Código curto já existe');
      }
      
      shortCode = customShortCode;
    } else {
      // Gera um código único
      do {
        shortCode = generateShortCode();
      } while (await this.getUrlByShortCode(shortCode));
    }

    const newUrl: NewUrl = {
      id: randomUUID(),
      originalUrl,
      shortCode,
      accessCount: 0,
    };

    const [url] = await db.insert(schema.urls).values(newUrl).returning();
    return url;
  }

  /**
   * Busca URL por código curto
   */
  async getUrlByShortCode(shortCode: string): Promise<Url | null> {
    const [url] = await db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.shortCode, shortCode))
      .limit(1);

    return url || null;
  }

  /**
   * Busca URL por ID
   */
  async getUrlById(id: string): Promise<Url | null> {
    const [url] = await db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.id, id))
      .limit(1);

    return url || null;
  }

  /**
   * Lista todas as URLs
   */
  async listUrls(): Promise<Url[]> {
    return await db.select().from(schema.urls).orderBy(schema.urls.createdAt);
  }

  /**
   * Incrementa contador de acessos
   */
  async incrementAccessCount(shortCode: string): Promise<Url | null> {
    const [url] = await db
      .update(schema.urls)
      .set({ 
        accessCount: sql`${schema.urls.accessCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(schema.urls.shortCode, shortCode))
      .returning();

    return url || null;
  }

  /**
   * Deleta uma URL
   */
  async deleteUrl(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.urls)
      .where(eq(schema.urls.id, id))
      .returning();

    return result.length > 0;
  }

  /**
   * Deleta uma URL por código curto
   */
  async deleteUrlByShortCode(shortCode: string): Promise<boolean> {
    const result = await db
      .delete(schema.urls)
      .where(eq(schema.urls.shortCode, shortCode))
      .returning();

    return result.length > 0;
  }
}

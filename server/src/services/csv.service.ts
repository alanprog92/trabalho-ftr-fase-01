import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { UrlService } from './url.service';
import { createId } from '@paralleldrive/cuid2';

interface CsvExportConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

export class CsvService {
  private s3Client: S3Client;
  private urlService: UrlService;
  private config: CsvExportConfig;

  constructor(config: CsvExportConfig) {
    this.config = config;
    this.urlService = new UrlService();
    
    // Configurar cliente S3 para Cloudflare R2
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Gera CSV com todas as URLs e faz upload para R2
   */
  async exportUrlsToCsv(): Promise<string> {
    try {
      // Buscar todas as URLs
      const urls = await this.urlService.listUrls();

      // Gerar conteúdo CSV
      const csvContent = this.generateCsvContent(urls);

      // Gerar nome único para o arquivo
      const fileName = `urls-export-${createId()}.csv`;

      // Upload para R2
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: fileName,
        Body: csvContent,
        ContentType: 'text/csv',
        ContentDisposition: `attachment; filename="${fileName}"`,
      });

      await this.s3Client.send(command);

      // Retornar URL pública
      const publicUrl = `${this.config.publicUrl}/${fileName}`;
      return publicUrl;
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      throw new Error('Falha ao exportar CSV');
    }
  }

  /**
   * Gera conteúdo CSV
   */
  private generateCsvContent(urls: any[]): string {
    const headers = ['ID', 'URL Original', 'URL Encurtada', 'Contagem de Acessos', 'Data de Criação'];
    const csvRows = [headers];

    urls.forEach(url => {
      const row = [
        url.id,
        url.originalUrl,
        url.shortCode,
        url.accessCount.toString(),
        url.createdAt.toISOString(),
      ];
      csvRows.push(row);
    });

    // Converter para string CSV
    return csvRows
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
}

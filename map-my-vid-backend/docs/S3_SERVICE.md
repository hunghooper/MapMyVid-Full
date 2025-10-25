# S3 Service Documentation

## Tổng quan

S3Service là một service toàn diện để tương tác với Amazon S3, cung cấp các tính năng upload, download, delete và quản lý files.

## Tính năng

### ✅ Đã implement
- **Upload files**: Upload buffer lên S3 với encryption
- **Delete files**: Xóa files khỏi S3
- **Get files**: Download files từ S3
- **List objects**: Liệt kê files trong bucket
- **Check existence**: Kiểm tra file có tồn tại không
- **Get metadata**: Lấy thông tin metadata của file
- **Health check**: Kiểm tra kết nối S3
- **Error handling**: Xử lý lỗi toàn diện
- **Logging**: Ghi log chi tiết
- **Validation**: Validate input parameters

### 🔧 Cấu hình

#### Environment Variables
```bash
# Required
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Optional (nếu không dùng IAM role)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

#### IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:HeadObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

## Sử dụng

### 1. Upload File
```typescript
const s3Service = new S3Service();
const url = await s3Service.uploadBuffer(
  'path/to/file.jpg',
  fileBuffer,
  'image/jpeg'
);
```

### 2. Download File
```typescript
const fileBuffer = await s3Service.getObject('path/to/file.jpg');
```

### 3. Delete File
```typescript
await s3Service.deleteObject('path/to/file.jpg');
```

### 4. List Files
```typescript
const files = await s3Service.listObjects('uploads/', 100);
```

### 5. Check File Exists
```typescript
const exists = await s3Service.objectExists('path/to/file.jpg');
```

### 6. Get File Metadata
```typescript
const metadata = await s3Service.getObjectMetadata('path/to/file.jpg');
```

### 7. Health Check
```typescript
const health = await s3Service.healthCheck();
```

## API Endpoints

### GET /s3/health
Kiểm tra trạng thái S3 service

### GET /s3/list?prefix=uploads/&maxKeys=100
Liệt kê files trong bucket

### GET /s3/metadata/:key
Lấy metadata của file

### GET /s3/exists/:key
Kiểm tra file có tồn tại không

### POST /s3/upload
Upload file (multipart/form-data)

### DELETE /s3/:key
Xóa file

## Error Handling

Service sử dụng error constants từ `ERROR_MESSAGES`:

- `VALIDATION.MISSING_PARAMETERS`: Thiếu tham số bắt buộc
- `FILE.INVALID_SIZE`: File quá lớn (>100MB)
- `FILE.UPLOAD_FAILED`: Lỗi upload
- `FILE.PROCESSING_FAILED`: Lỗi xử lý file

## Security Features

- **Server-side encryption**: AES256 encryption
- **File size validation**: Giới hạn 100MB
- **Input validation**: Validate tất cả parameters
- **Error logging**: Log chi tiết cho debugging
- **Metadata tracking**: Track upload time và file size

## Monitoring

Service cung cấp logging chi tiết:
- Upload/download operations
- Error tracking
- Performance metrics
- Health check status

## Testing

Chạy tests:
```bash
npm test s3.service.spec.ts
```

## Troubleshooting

### Lỗi thường gặp

1. **Missing credentials**: Kiểm tra AWS credentials
2. **Bucket not found**: Kiểm tra bucket name
3. **Permission denied**: Kiểm tra IAM permissions
4. **File too large**: File > 100MB

### Debug

Enable debug logging:
```typescript
// Trong main.ts
process.env.LOG_LEVEL = 'debug';
```

## Best Practices

1. **Use IAM roles** thay vì access keys khi có thể
2. **Validate file types** trước khi upload
3. **Use appropriate prefixes** để organize files
4. **Monitor costs** với CloudWatch
5. **Set up lifecycle policies** cho old files
6. **Use CloudFront** cho public files

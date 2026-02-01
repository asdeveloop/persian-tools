import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCompressPage from './ImageCompressPage';

describe('ImageCompressPage', () => {
  it('should render page title and upload area', () => {
    render(<ImageCompressPage />);

    expect(screen.getByText('فشرده‌سازی عکس')).toBeInTheDocument();
    expect(screen.getByText('کاهش حجم عکس‌ها با کیفیت بالا. پردازش کاملاً روی دستگاه شما انجام می‌شود.')).toBeInTheDocument();
    expect(screen.getByLabelText('انتخاب عکس')).toBeInTheDocument();
  });

  it('should show file preview after upload', async () => {
    const user = userEvent.setup();

    render(
      <ImageCompressPage
        compress={async () => {
          const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' });
          return {
            outputBlob: blob,
            outputMimeType: 'image/jpeg',
            outputBytes: blob.size,
            outputWidth: 10,
            outputHeight: 10,
            noteFa: null,
          };
        }}
      />,
    );

    const fileInput = screen.getByLabelText('انتخاب عکس');
    const f = new File([new Uint8Array([1, 2, 3, 4])], 'a.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput, f);

    expect(screen.getByText('عکس انتخاب شده')).toBeInTheDocument();
    expect(screen.getByText('عکس اصلی')).toBeInTheDocument();
    expect(screen.getByText('حجم فایل')).toBeInTheDocument();
  });

  it('should show compress button after file upload', async () => {
    const user = userEvent.setup();

    render(
      <ImageCompressPage
        compress={async () => {
          const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' });
          return {
            outputBlob: blob,
            outputMimeType: 'image/jpeg',
            outputBytes: blob.size,
            outputWidth: 10,
            outputHeight: 10,
            noteFa: null,
          };
        }}
      />,
    );

    const fileInput = screen.getByLabelText('انتخاب عکس');
    const f = new File([new Uint8Array([1, 2, 3, 4])], 'a.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput, f);

    expect(screen.getByRole('button', { name: 'فشرده‌سازی' })).toBeInTheDocument();
  });
});

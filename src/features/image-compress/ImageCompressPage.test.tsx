import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCompressPage from './ImageCompressPage';

describe('ImageCompressPage', () => {
  it('should compress and show download link (mocked)', async () => {
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
            noteFa: null
          };
        }}
      />
    );

    const fileInput = screen.getByLabelText('انتخاب عکس');
    const f = new File([new Uint8Array([1, 2, 3, 4])], 'a.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput, f);

    await user.click(screen.getByRole('button', { name: 'فشرده‌سازی' }));

    expect(await screen.findByText('دانلود فایل خروجی')).toBeInTheDocument();
  });
});

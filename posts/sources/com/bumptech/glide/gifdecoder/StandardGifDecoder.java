package com.bumptech.glide.gifdecoder;

import android.graphics.Bitmap;
import android.util.Log;
import com.bumptech.glide.gifdecoder.GifDecoder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;
import java.util.Iterator;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class StandardGifDecoder implements GifDecoder {
    private static final int BYTES_PER_INTEGER = 4;
    private static final int COLOR_TRANSPARENT_BLACK = 0;
    private static final int INITIAL_FRAME_POINTER = -1;
    private static final int MASK_INT_LOWEST_BYTE = 255;
    private static final int MAX_STACK_SIZE = 4096;
    private static final int NULL_CODE = -1;
    private static final String TAG = "StandardGifDecoder";
    private int[] act;
    private Bitmap.Config bitmapConfig;
    private final GifDecoder.BitmapProvider bitmapProvider;
    private byte[] block;
    private int downsampledHeight;
    private int downsampledWidth;
    private int framePointer;
    private GifHeader header;
    private Boolean isFirstFrameTransparent;
    private byte[] mainPixels;
    private int[] mainScratch;
    private GifHeaderParser parser;
    private final int[] pct;
    private byte[] pixelStack;
    private short[] prefix;
    private Bitmap previousImage;
    private ByteBuffer rawData;
    private int sampleSize;
    private boolean savePrevious;
    private int status;
    private byte[] suffix;

    public StandardGifDecoder(GifDecoder.BitmapProvider bitmapProvider, GifHeader gifHeader, ByteBuffer byteBuffer) {
        this(bitmapProvider, gifHeader, byteBuffer, 1);
    }

    private int averageColorsNear(int i, int i2, int i3) {
        int i4 = 0;
        int i5 = 0;
        int i6 = 0;
        int i7 = 0;
        int i8 = 0;
        for (int i9 = i; i9 < this.sampleSize + i; i9++) {
            byte[] bArr = this.mainPixels;
            if (i9 >= bArr.length || i9 >= i2) {
                break;
            }
            int i10 = this.act[bArr[i9] & 255];
            if (i10 != 0) {
                i4 += (i10 >> 24) & 255;
                i5 += (i10 >> 16) & 255;
                i6 += (i10 >> 8) & 255;
                i7 += i10 & 255;
                i8++;
            }
        }
        int i11 = i + i3;
        for (int i12 = i11; i12 < this.sampleSize + i11; i12++) {
            byte[] bArr2 = this.mainPixels;
            if (i12 >= bArr2.length || i12 >= i2) {
                break;
            }
            int i13 = this.act[bArr2[i12] & 255];
            if (i13 != 0) {
                i4 += (i13 >> 24) & 255;
                i5 += (i13 >> 16) & 255;
                i6 += (i13 >> 8) & 255;
                i7 += i13 & 255;
                i8++;
            }
        }
        if (i8 == 0) {
            return 0;
        }
        return ((i4 / i8) << 24) | ((i5 / i8) << 16) | ((i6 / i8) << 8) | (i7 / i8);
    }

    private void copyCopyIntoScratchRobust(GifFrame gifFrame) {
        int i;
        int i2;
        int i3;
        int i4;
        int i5;
        int[] iArr = this.mainScratch;
        int i6 = gifFrame.f3828ih;
        int i7 = this.sampleSize;
        int i8 = i6 / i7;
        int i9 = gifFrame.f3831iy / i7;
        int i10 = gifFrame.f3829iw / i7;
        int i11 = gifFrame.f3830ix / i7;
        boolean z = this.framePointer == 0;
        int i12 = this.downsampledWidth;
        int i13 = this.downsampledHeight;
        byte[] bArr = this.mainPixels;
        int[] iArr2 = this.act;
        Boolean bool = this.isFirstFrameTransparent;
        int i14 = 8;
        int i15 = 0;
        int i16 = 0;
        int i17 = 1;
        while (i15 < i8) {
            Boolean bool2 = bool;
            if (gifFrame.interlace) {
                if (i16 >= i8) {
                    i = i8;
                    int i18 = i17 + 1;
                    if (i18 == 2) {
                        i17 = i18;
                        i16 = 4;
                    } else if (i18 == 3) {
                        i17 = i18;
                        i16 = 2;
                        i14 = 4;
                    } else if (i18 != 4) {
                        i17 = i18;
                    } else {
                        i17 = i18;
                        i16 = 1;
                        i14 = 2;
                    }
                } else {
                    i = i8;
                }
                i2 = i16 + i14;
            } else {
                i = i8;
                i2 = i16;
                i16 = i15;
            }
            int i19 = i16 + i9;
            boolean z2 = i7 == 1;
            if (i19 < i13) {
                int i20 = i19 * i12;
                int i21 = i20 + i11;
                int i22 = i21 + i10;
                int i23 = i20 + i12;
                if (i23 < i22) {
                    i22 = i23;
                }
                i3 = i2;
                int i24 = i15 * i7 * gifFrame.f3829iw;
                if (z2) {
                    int i25 = i21;
                    while (i25 < i22) {
                        int i26 = i9;
                        int i27 = iArr2[bArr[i24] & 255];
                        if (i27 != 0) {
                            iArr[i25] = i27;
                        } else if (z && bool2 == null) {
                            bool2 = Boolean.TRUE;
                        }
                        i24 += i7;
                        i25++;
                        i9 = i26;
                    }
                } else {
                    i5 = i9;
                    int i28 = ((i22 - i21) * i7) + i24;
                    int i29 = i21;
                    while (true) {
                        i4 = i10;
                        if (i29 < i22) {
                            int averageColorsNear = averageColorsNear(i24, i28, gifFrame.f3829iw);
                            if (averageColorsNear != 0) {
                                iArr[i29] = averageColorsNear;
                            } else if (z && bool2 == null) {
                                bool2 = Boolean.TRUE;
                            }
                            i24 += i7;
                            i29++;
                            i10 = i4;
                        }
                    }
                    bool = bool2;
                    i15++;
                    i9 = i5;
                    i10 = i4;
                    i8 = i;
                    i16 = i3;
                }
            } else {
                i3 = i2;
            }
            i5 = i9;
            i4 = i10;
            bool = bool2;
            i15++;
            i9 = i5;
            i10 = i4;
            i8 = i;
            i16 = i3;
        }
        Boolean bool3 = bool;
        if (this.isFirstFrameTransparent == null) {
            this.isFirstFrameTransparent = Boolean.valueOf(bool3 == null ? false : bool3.booleanValue());
        }
    }

    private void copyIntoScratchFast(GifFrame gifFrame) {
        GifFrame gifFrame2 = gifFrame;
        int[] iArr = this.mainScratch;
        int i = gifFrame2.f3828ih;
        int i2 = gifFrame2.f3831iy;
        int i3 = gifFrame2.f3829iw;
        int i4 = gifFrame2.f3830ix;
        boolean z = this.framePointer == 0;
        int i5 = this.downsampledWidth;
        byte[] bArr = this.mainPixels;
        int[] iArr2 = this.act;
        int i6 = 0;
        byte b = -1;
        while (i6 < i) {
            int i7 = (i6 + i2) * i5;
            int i8 = i7 + i4;
            int i9 = i8 + i3;
            int i10 = i7 + i5;
            if (i10 < i9) {
                i9 = i10;
            }
            int i11 = gifFrame2.f3829iw * i6;
            int i12 = i8;
            while (i12 < i9) {
                byte b2 = bArr[i11];
                int i13 = i;
                int i14 = b2 & 255;
                if (i14 != b) {
                    int i15 = iArr2[i14];
                    if (i15 != 0) {
                        iArr[i12] = i15;
                    } else {
                        b = b2;
                    }
                }
                i11++;
                i12++;
                i = i13;
            }
            i6++;
            gifFrame2 = gifFrame;
        }
        Boolean bool = this.isFirstFrameTransparent;
        this.isFirstFrameTransparent = Boolean.valueOf((bool != null && bool.booleanValue()) || (this.isFirstFrameTransparent == null && z && b != -1));
    }

    /* JADX WARN: Multi-variable type inference failed */
    private void decodeBitmapData(GifFrame gifFrame) {
        int i;
        int i2;
        short s;
        StandardGifDecoder standardGifDecoder = this;
        if (gifFrame != null) {
            standardGifDecoder.rawData.position(gifFrame.bufferFrameStart);
        }
        if (gifFrame == null) {
            GifHeader gifHeader = standardGifDecoder.header;
            i = gifHeader.width;
            i2 = gifHeader.height;
        } else {
            i = gifFrame.f3829iw;
            i2 = gifFrame.f3828ih;
        }
        int i3 = i * i2;
        byte[] bArr = standardGifDecoder.mainPixels;
        if (bArr == null || bArr.length < i3) {
            standardGifDecoder.mainPixels = standardGifDecoder.bitmapProvider.obtainByteArray(i3);
        }
        byte[] bArr2 = standardGifDecoder.mainPixels;
        if (standardGifDecoder.prefix == null) {
            standardGifDecoder.prefix = new short[4096];
        }
        short[] sArr = standardGifDecoder.prefix;
        if (standardGifDecoder.suffix == null) {
            standardGifDecoder.suffix = new byte[4096];
        }
        byte[] bArr3 = standardGifDecoder.suffix;
        if (standardGifDecoder.pixelStack == null) {
            standardGifDecoder.pixelStack = new byte[4097];
        }
        byte[] bArr4 = standardGifDecoder.pixelStack;
        int readByte = readByte();
        int i4 = 1 << readByte;
        int i5 = i4 + 1;
        int i6 = i4 + 2;
        int i7 = readByte + 1;
        int i8 = (1 << i7) - 1;
        int i9 = 0;
        for (int i10 = 0; i10 < i4; i10++) {
            sArr[i10] = 0;
            bArr3[i10] = (byte) i10;
        }
        byte[] bArr5 = standardGifDecoder.block;
        int i11 = i7;
        int i12 = i6;
        int i13 = i8;
        int i14 = 0;
        int i15 = 0;
        int i16 = 0;
        int i17 = 0;
        int i18 = 0;
        int i19 = -1;
        int i20 = 0;
        int i21 = 0;
        while (true) {
            if (i9 >= i3) {
                break;
            }
            if (i14 == 0) {
                i14 = readBlock();
                if (i14 <= 0) {
                    standardGifDecoder.status = 3;
                    break;
                }
                i15 = 0;
            }
            i17 += (bArr5[i15] & 255) << i16;
            i15++;
            i14--;
            int i22 = i16 + 8;
            int i23 = i12;
            int i24 = i11;
            int i25 = i19;
            int i26 = i7;
            int i27 = i20;
            while (true) {
                if (i22 < i24) {
                    i19 = i25;
                    i12 = i23;
                    i16 = i22;
                    standardGifDecoder = this;
                    i20 = i27;
                    i7 = i26;
                    i11 = i24;
                    break;
                }
                int i28 = i6;
                int i29 = i17 & i13;
                i17 >>= i24;
                i22 -= i24;
                if (i29 == i4) {
                    i13 = i8;
                    i24 = i26;
                    i23 = i28;
                    i6 = i23;
                    i25 = -1;
                } else if (i29 == i5) {
                    i16 = i22;
                    i20 = i27;
                    i12 = i23;
                    i7 = i26;
                    i6 = i28;
                    i19 = i25;
                    i11 = i24;
                    standardGifDecoder = this;
                    break;
                } else if (i25 == -1) {
                    bArr2[i18] = bArr3[i29];
                    i18++;
                    i9++;
                    i25 = i29;
                    i27 = i25;
                    i6 = i28;
                    i22 = i22;
                } else {
                    if (i29 >= i23) {
                        bArr4[i21] = (byte) i27;
                        i21++;
                        s = i25;
                    } else {
                        s = i29;
                    }
                    while (s >= i4) {
                        bArr4[i21] = bArr3[s];
                        i21++;
                        s = sArr[s];
                    }
                    i27 = bArr3[s] & 255;
                    byte b = (byte) i27;
                    bArr2[i18] = b;
                    while (true) {
                        i18++;
                        i9++;
                        if (i21 <= 0) {
                            break;
                        }
                        i21--;
                        bArr2[i18] = bArr4[i21];
                    }
                    byte[] bArr6 = bArr4;
                    if (i23 < 4096) {
                        sArr[i23] = (short) i25;
                        bArr3[i23] = b;
                        i23++;
                        if ((i23 & i13) == 0 && i23 < 4096) {
                            i24++;
                            i13 += i23;
                        }
                    }
                    i25 = i29;
                    i6 = i28;
                    i22 = i22;
                    bArr4 = bArr6;
                }
            }
        }
        Arrays.fill(bArr2, i18, i3, (byte) 0);
    }

    private GifHeaderParser getHeaderParser() {
        if (this.parser == null) {
            this.parser = new GifHeaderParser();
        }
        return this.parser;
    }

    private Bitmap getNextBitmap() {
        Boolean bool = this.isFirstFrameTransparent;
        Bitmap obtain = this.bitmapProvider.obtain(this.downsampledWidth, this.downsampledHeight, (bool == null || bool.booleanValue()) ? Bitmap.Config.ARGB_8888 : this.bitmapConfig);
        obtain.setHasAlpha(true);
        return obtain;
    }

    private int readBlock() {
        int readByte = readByte();
        if (readByte <= 0) {
            return readByte;
        }
        ByteBuffer byteBuffer = this.rawData;
        byteBuffer.get(this.block, 0, Math.min(readByte, byteBuffer.remaining()));
        return readByte;
    }

    private int readByte() {
        return this.rawData.get() & 255;
    }

    private Bitmap setPixels(GifFrame gifFrame, GifFrame gifFrame2) {
        int i;
        int i2;
        Bitmap bitmap;
        int[] iArr = this.mainScratch;
        int i3 = 0;
        if (gifFrame2 == null) {
            Bitmap bitmap2 = this.previousImage;
            if (bitmap2 != null) {
                this.bitmapProvider.release(bitmap2);
            }
            this.previousImage = null;
            Arrays.fill(iArr, 0);
        }
        if (gifFrame2 != null && gifFrame2.dispose == 3 && this.previousImage == null) {
            Arrays.fill(iArr, 0);
        }
        if (gifFrame2 != null && (i2 = gifFrame2.dispose) > 0) {
            if (i2 == 2) {
                if (!gifFrame.transparency) {
                    GifHeader gifHeader = this.header;
                    int i4 = gifHeader.bgColor;
                    if (gifFrame.lct == null || gifHeader.bgIndex != gifFrame.transIndex) {
                        i3 = i4;
                    }
                }
                int i5 = gifFrame2.f3828ih;
                int i6 = this.sampleSize;
                int i7 = i5 / i6;
                int i8 = gifFrame2.f3831iy / i6;
                int i9 = gifFrame2.f3829iw / i6;
                int i10 = gifFrame2.f3830ix / i6;
                int i11 = this.downsampledWidth;
                int i12 = (i8 * i11) + i10;
                int i13 = (i7 * i11) + i12;
                while (i12 < i13) {
                    int i14 = i12 + i9;
                    for (int i15 = i12; i15 < i14; i15++) {
                        iArr[i15] = i3;
                    }
                    i12 += this.downsampledWidth;
                }
            } else if (i2 == 3 && (bitmap = this.previousImage) != null) {
                int i16 = this.downsampledWidth;
                bitmap.getPixels(iArr, 0, i16, 0, 0, i16, this.downsampledHeight);
            }
        }
        decodeBitmapData(gifFrame);
        if (!gifFrame.interlace && this.sampleSize == 1) {
            copyIntoScratchFast(gifFrame);
        } else {
            copyCopyIntoScratchRobust(gifFrame);
        }
        if (this.savePrevious && ((i = gifFrame.dispose) == 0 || i == 1)) {
            if (this.previousImage == null) {
                this.previousImage = getNextBitmap();
            }
            Bitmap bitmap3 = this.previousImage;
            int i17 = this.downsampledWidth;
            bitmap3.setPixels(iArr, 0, i17, 0, 0, i17, this.downsampledHeight);
        }
        Bitmap nextBitmap = getNextBitmap();
        int i18 = this.downsampledWidth;
        nextBitmap.setPixels(iArr, 0, i18, 0, 0, i18, this.downsampledHeight);
        return nextBitmap;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public void advance() {
        this.framePointer = (this.framePointer + 1) % this.header.frameCount;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public void clear() {
        this.header = null;
        byte[] bArr = this.mainPixels;
        if (bArr != null) {
            this.bitmapProvider.release(bArr);
        }
        int[] iArr = this.mainScratch;
        if (iArr != null) {
            this.bitmapProvider.release(iArr);
        }
        Bitmap bitmap = this.previousImage;
        if (bitmap != null) {
            this.bitmapProvider.release(bitmap);
        }
        this.previousImage = null;
        this.rawData = null;
        this.isFirstFrameTransparent = null;
        byte[] bArr2 = this.block;
        if (bArr2 != null) {
            this.bitmapProvider.release(bArr2);
        }
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getByteSize() {
        return (this.mainScratch.length * 4) + this.rawData.limit() + this.mainPixels.length;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getCurrentFrameIndex() {
        return this.framePointer;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public ByteBuffer getData() {
        return this.rawData;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getDelay(int i) {
        if (i >= 0) {
            GifHeader gifHeader = this.header;
            if (i < gifHeader.frameCount) {
                return gifHeader.frames.get(i).delay;
            }
        }
        return -1;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getFrameCount() {
        return this.header.frameCount;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getHeight() {
        return this.header.height;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    @Deprecated
    public int getLoopCount() {
        int i = this.header.loopCount;
        if (i == -1) {
            return 1;
        }
        return i;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getNetscapeLoopCount() {
        return this.header.loopCount;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getNextDelay() {
        int i;
        if (this.header.frameCount <= 0 || (i = this.framePointer) < 0) {
            return 0;
        }
        return getDelay(i);
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public synchronized Bitmap getNextFrame() {
        if (this.header.frameCount <= 0 || this.framePointer < 0) {
            String str = TAG;
            if (Log.isLoggable(str, 3)) {
                Log.d(str, "Unable to decode frame, frameCount=" + this.header.frameCount + ", framePointer=" + this.framePointer);
            }
            this.status = 1;
        }
        int i = this.status;
        if (i != 1 && i != 2) {
            this.status = 0;
            if (this.block == null) {
                this.block = this.bitmapProvider.obtainByteArray(255);
            }
            GifFrame gifFrame = this.header.frames.get(this.framePointer);
            int i2 = this.framePointer - 1;
            GifFrame gifFrame2 = i2 >= 0 ? this.header.frames.get(i2) : null;
            int[] iArr = gifFrame.lct;
            if (iArr == null) {
                iArr = this.header.gct;
            }
            this.act = iArr;
            if (iArr == null) {
                String str2 = TAG;
                if (Log.isLoggable(str2, 3)) {
                    Log.d(str2, "No valid color table found for frame #" + this.framePointer);
                }
                this.status = 1;
                return null;
            }
            if (gifFrame.transparency) {
                System.arraycopy(iArr, 0, this.pct, 0, iArr.length);
                int[] iArr2 = this.pct;
                this.act = iArr2;
                iArr2[gifFrame.transIndex] = 0;
                if (gifFrame.dispose == 2 && this.framePointer == 0) {
                    this.isFirstFrameTransparent = Boolean.TRUE;
                }
            }
            return setPixels(gifFrame, gifFrame2);
        }
        String str3 = TAG;
        if (Log.isLoggable(str3, 3)) {
            Log.d(str3, "Unable to decode frame, status=" + this.status);
        }
        return null;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getStatus() {
        return this.status;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getTotalIterationCount() {
        int i = this.header.loopCount;
        if (i == -1) {
            return 1;
        }
        if (i == 0) {
            return 0;
        }
        return i + 1;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int getWidth() {
        return this.header.width;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public int read(InputStream inputStream, int i) {
        if (inputStream != null) {
            try {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(i > 0 ? i + 4096 : 16384);
                byte[] bArr = new byte[16384];
                while (true) {
                    int read = inputStream.read(bArr, 0, 16384);
                    if (read == -1) {
                        break;
                    }
                    byteArrayOutputStream.write(bArr, 0, read);
                }
                byteArrayOutputStream.flush();
                read(byteArrayOutputStream.toByteArray());
            } catch (IOException e) {
                Log.w(TAG, "Error reading data from stream", e);
            }
        } else {
            this.status = 2;
        }
        if (inputStream != null) {
            try {
                inputStream.close();
            } catch (IOException e2) {
                Log.w(TAG, "Error closing stream", e2);
            }
        }
        return this.status;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public void resetFrameIndex() {
        this.framePointer = -1;
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public synchronized void setData(GifHeader gifHeader, byte[] bArr) {
        setData(gifHeader, ByteBuffer.wrap(bArr));
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public void setDefaultBitmapConfig(Bitmap.Config config) {
        if (config != Bitmap.Config.ARGB_8888 && config != Bitmap.Config.RGB_565) {
            throw new IllegalArgumentException("Unsupported format: " + config + ", must be one of " + Bitmap.Config.ARGB_8888 + " or " + Bitmap.Config.RGB_565);
        }
        this.bitmapConfig = config;
    }

    public StandardGifDecoder(GifDecoder.BitmapProvider bitmapProvider, GifHeader gifHeader, ByteBuffer byteBuffer, int i) {
        this(bitmapProvider);
        setData(gifHeader, byteBuffer, i);
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public synchronized void setData(GifHeader gifHeader, ByteBuffer byteBuffer) {
        setData(gifHeader, byteBuffer, 1);
    }

    public StandardGifDecoder(GifDecoder.BitmapProvider bitmapProvider) {
        this.pct = new int[256];
        this.bitmapConfig = Bitmap.Config.ARGB_8888;
        this.bitmapProvider = bitmapProvider;
        this.header = new GifHeader();
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public synchronized void setData(GifHeader gifHeader, ByteBuffer byteBuffer, int i) {
        if (i > 0) {
            int highestOneBit = Integer.highestOneBit(i);
            this.status = 0;
            this.header = gifHeader;
            this.framePointer = -1;
            ByteBuffer asReadOnlyBuffer = byteBuffer.asReadOnlyBuffer();
            this.rawData = asReadOnlyBuffer;
            asReadOnlyBuffer.position(0);
            this.rawData.order(ByteOrder.LITTLE_ENDIAN);
            this.savePrevious = false;
            Iterator<GifFrame> it = gifHeader.frames.iterator();
            while (true) {
                if (!it.hasNext()) {
                    break;
                } else if (it.next().dispose == 3) {
                    this.savePrevious = true;
                    break;
                }
            }
            this.sampleSize = highestOneBit;
            int i2 = gifHeader.width;
            this.downsampledWidth = i2 / highestOneBit;
            int i3 = gifHeader.height;
            this.downsampledHeight = i3 / highestOneBit;
            this.mainPixels = this.bitmapProvider.obtainByteArray(i2 * i3);
            this.mainScratch = this.bitmapProvider.obtainIntArray(this.downsampledWidth * this.downsampledHeight);
        } else {
            throw new IllegalArgumentException("Sample size must be >=0, not: " + i);
        }
    }

    @Override // com.bumptech.glide.gifdecoder.GifDecoder
    public synchronized int read(byte[] bArr) {
        GifHeader parseHeader = getHeaderParser().setData(bArr).parseHeader();
        this.header = parseHeader;
        if (bArr != null) {
            setData(parseHeader, bArr);
        }
        return this.status;
    }
}

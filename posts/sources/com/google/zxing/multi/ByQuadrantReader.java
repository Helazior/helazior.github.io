package com.google.zxing.multi;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.NotFoundException;
import com.google.zxing.Reader;
import com.google.zxing.Result;
import java.util.Map;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class ByQuadrantReader implements Reader {
    private final Reader delegate;

    public ByQuadrantReader(Reader reader) {
        this.delegate = reader;
    }

    @Override // com.google.zxing.Reader
    public Result decode(BinaryBitmap binaryBitmap) {
        return decode(binaryBitmap, null);
    }

    @Override // com.google.zxing.Reader
    public void reset() {
        this.delegate.reset();
    }

    @Override // com.google.zxing.Reader
    public Result decode(BinaryBitmap binaryBitmap, Map<DecodeHintType, ?> map) {
        int width = binaryBitmap.getWidth() / 2;
        int height = binaryBitmap.getHeight() / 2;
        try {
            return this.delegate.decode(binaryBitmap.crop(0, 0, width, height), map);
        } catch (NotFoundException unused) {
            try {
                return this.delegate.decode(binaryBitmap.crop(width, 0, width, height), map);
            } catch (NotFoundException unused2) {
                try {
                    return this.delegate.decode(binaryBitmap.crop(0, height, width, height), map);
                } catch (NotFoundException unused3) {
                    try {
                        return this.delegate.decode(binaryBitmap.crop(width, height, width, height), map);
                    } catch (NotFoundException unused4) {
                        return this.delegate.decode(binaryBitmap.crop(width / 2, height / 2, width, height), map);
                    }
                }
            }
        }
    }
}

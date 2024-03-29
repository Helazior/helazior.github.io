package com.bumptech.glide.load.resource.bitmap;

import android.graphics.Bitmap;
import android.graphics.ImageDecoder;
import com.bumptech.glide.load.Options;
import com.bumptech.glide.load.ResourceDecoder;
import com.bumptech.glide.load.engine.Resource;
import com.bumptech.glide.util.ByteBufferUtil;
import java.io.InputStream;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class InputStreamBitmapImageDecoderResourceDecoder implements ResourceDecoder<InputStream, Bitmap> {
    private final BitmapImageDecoderResourceDecoder wrapped = new BitmapImageDecoderResourceDecoder();

    @Override // com.bumptech.glide.load.ResourceDecoder
    public boolean handles(InputStream inputStream, Options options) {
        return true;
    }

    @Override // com.bumptech.glide.load.ResourceDecoder
    public Resource<Bitmap> decode(InputStream inputStream, int i, int i2, Options options) {
        return this.wrapped.decode(ImageDecoder.createSource(ByteBufferUtil.fromStream(inputStream)), i, i2, options);
    }
}

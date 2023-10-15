package com.bumptech.glide.load.resource.bitmap;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import com.bumptech.glide.load.Options;
import com.bumptech.glide.load.ResourceDecoder;
import com.bumptech.glide.load.engine.Resource;
import com.bumptech.glide.load.engine.bitmap_recycle.BitmapPool;
import com.bumptech.glide.util.Preconditions;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class BitmapDrawableDecoder<DataType> implements ResourceDecoder<DataType, BitmapDrawable> {
    private final ResourceDecoder<DataType, Bitmap> decoder;
    private final Resources resources;

    public BitmapDrawableDecoder(Context context, ResourceDecoder<DataType, Bitmap> resourceDecoder) {
        this(context.getResources(), resourceDecoder);
    }

    @Override // com.bumptech.glide.load.ResourceDecoder
    public Resource<BitmapDrawable> decode(DataType datatype, int i, int i2, Options options) {
        return LazyBitmapDrawableResource.obtain(this.resources, this.decoder.decode(datatype, i, i2, options));
    }

    @Override // com.bumptech.glide.load.ResourceDecoder
    public boolean handles(DataType datatype, Options options) {
        return this.decoder.handles(datatype, options);
    }

    @Deprecated
    public BitmapDrawableDecoder(Resources resources, BitmapPool bitmapPool, ResourceDecoder<DataType, Bitmap> resourceDecoder) {
        this(resources, resourceDecoder);
    }

    public BitmapDrawableDecoder(Resources resources, ResourceDecoder<DataType, Bitmap> resourceDecoder) {
        this.resources = (Resources) Preconditions.checkNotNull(resources);
        this.decoder = (ResourceDecoder) Preconditions.checkNotNull(resourceDecoder);
    }
}

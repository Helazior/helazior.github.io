package com.bumptech.glide.load.resource.drawable;

import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import com.bumptech.glide.load.engine.Initializable;
import com.bumptech.glide.load.engine.Resource;
import com.bumptech.glide.load.resource.gif.GifDrawable;
import com.bumptech.glide.util.Preconditions;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class DrawableResource<T extends Drawable> implements Resource<T>, Initializable {
    public final T drawable;

    public DrawableResource(T t) {
        this.drawable = (T) Preconditions.checkNotNull(t);
    }

    public void initialize() {
        T t = this.drawable;
        if (t instanceof BitmapDrawable) {
            ((BitmapDrawable) t).getBitmap().prepareToDraw();
        } else if (t instanceof GifDrawable) {
            ((GifDrawable) t).getFirstFrame().prepareToDraw();
        }
    }

    @Override // com.bumptech.glide.load.engine.Resource
    public final T get() {
        Drawable.ConstantState constantState = this.drawable.getConstantState();
        if (constantState == null) {
            return this.drawable;
        }
        return (T) constantState.newDrawable();
    }
}
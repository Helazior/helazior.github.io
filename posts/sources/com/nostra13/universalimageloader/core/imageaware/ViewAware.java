package com.nostra13.universalimageloader.core.imageaware;

import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import com.nostra13.universalimageloader.core.assist.ViewScaleType;
import com.nostra13.universalimageloader.utils.C1564L;
import java.lang.ref.Reference;
import java.lang.ref.WeakReference;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class ViewAware implements ImageAware {
    public static final String WARN_CANT_SET_BITMAP = "Can't set a bitmap into view. You should call ImageLoader on UI thread for it.";
    public static final String WARN_CANT_SET_DRAWABLE = "Can't set a drawable into view. You should call ImageLoader on UI thread for it.";
    public boolean checkActualViewSize;
    public Reference<View> viewRef;

    public ViewAware(View view) {
        this(view, true);
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public int getHeight() {
        View view = this.viewRef.get();
        int i = 0;
        if (view != null) {
            ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
            if (this.checkActualViewSize && layoutParams != null && layoutParams.height != -2) {
                i = view.getHeight();
            }
            return (i > 0 || layoutParams == null) ? i : layoutParams.height;
        }
        return 0;
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public int getId() {
        View view = this.viewRef.get();
        return view == null ? super.hashCode() : view.hashCode();
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public ViewScaleType getScaleType() {
        return ViewScaleType.CROP;
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public int getWidth() {
        View view = this.viewRef.get();
        int i = 0;
        if (view != null) {
            ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
            if (this.checkActualViewSize && layoutParams != null && layoutParams.width != -2) {
                i = view.getWidth();
            }
            return (i > 0 || layoutParams == null) ? i : layoutParams.width;
        }
        return 0;
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public View getWrappedView() {
        return this.viewRef.get();
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public boolean isCollected() {
        return this.viewRef.get() == null;
    }

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public boolean setImageBitmap(Bitmap bitmap) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            View view = this.viewRef.get();
            if (view != null) {
                setImageBitmapInto(bitmap, view);
                return true;
            }
        } else {
            C1564L.m1065w(WARN_CANT_SET_BITMAP, new Object[0]);
        }
        return false;
    }

    public abstract void setImageBitmapInto(Bitmap bitmap, View view);

    @Override // com.nostra13.universalimageloader.core.imageaware.ImageAware
    public boolean setImageDrawable(Drawable drawable) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            View view = this.viewRef.get();
            if (view != null) {
                setImageDrawableInto(drawable, view);
                return true;
            }
        } else {
            C1564L.m1065w(WARN_CANT_SET_DRAWABLE, new Object[0]);
        }
        return false;
    }

    public abstract void setImageDrawableInto(Drawable drawable, View view);

    public ViewAware(View view, boolean z) {
        if (view != null) {
            this.viewRef = new WeakReference(view);
            this.checkActualViewSize = z;
            return;
        }
        throw new IllegalArgumentException("view must not be null");
    }
}

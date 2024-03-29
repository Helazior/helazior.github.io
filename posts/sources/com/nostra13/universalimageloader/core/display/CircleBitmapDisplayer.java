package com.nostra13.universalimageloader.core.display;

import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.drawable.Drawable;
import com.nostra13.universalimageloader.core.assist.LoadedFrom;
import com.nostra13.universalimageloader.core.imageaware.ImageAware;
import com.nostra13.universalimageloader.core.imageaware.ImageViewAware;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CircleBitmapDisplayer implements BitmapDisplayer {
    public final Integer strokeColor;
    public final float strokeWidth;

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class CircleDrawable extends Drawable {
        public final BitmapShader bitmapShader;
        public final RectF mBitmapRect;
        public final RectF mRect = new RectF();
        public final Paint paint;
        public float radius;
        public final Paint strokePaint;
        public float strokeRadius;
        public final float strokeWidth;

        public CircleDrawable(Bitmap bitmap, Integer num, float f) {
            this.radius = Math.min(bitmap.getWidth(), bitmap.getHeight()) / 2;
            Shader.TileMode tileMode = Shader.TileMode.CLAMP;
            BitmapShader bitmapShader = new BitmapShader(bitmap, tileMode, tileMode);
            this.bitmapShader = bitmapShader;
            this.mBitmapRect = new RectF(0.0f, 0.0f, bitmap.getWidth(), bitmap.getHeight());
            Paint paint = new Paint();
            this.paint = paint;
            paint.setAntiAlias(true);
            paint.setShader(bitmapShader);
            paint.setFilterBitmap(true);
            paint.setDither(true);
            if (num == null) {
                this.strokePaint = null;
            } else {
                Paint paint2 = new Paint();
                this.strokePaint = paint2;
                paint2.setStyle(Paint.Style.STROKE);
                paint2.setColor(num.intValue());
                paint2.setStrokeWidth(f);
                paint2.setAntiAlias(true);
            }
            this.strokeWidth = f;
            this.strokeRadius = this.radius - (f / 2.0f);
        }

        @Override // android.graphics.drawable.Drawable
        public void draw(Canvas canvas) {
            float f = this.radius;
            canvas.drawCircle(f, f, f, this.paint);
            Paint paint = this.strokePaint;
            if (paint != null) {
                float f2 = this.radius;
                canvas.drawCircle(f2, f2, this.strokeRadius, paint);
            }
        }

        @Override // android.graphics.drawable.Drawable
        public int getOpacity() {
            return -3;
        }

        @Override // android.graphics.drawable.Drawable
        public void onBoundsChange(Rect rect) {
            super.onBoundsChange(rect);
            this.mRect.set(0.0f, 0.0f, rect.width(), rect.height());
            float min = Math.min(rect.width(), rect.height()) / 2;
            this.radius = min;
            this.strokeRadius = min - (this.strokeWidth / 2.0f);
            Matrix matrix = new Matrix();
            matrix.setRectToRect(this.mBitmapRect, this.mRect, Matrix.ScaleToFit.FILL);
            this.bitmapShader.setLocalMatrix(matrix);
        }

        @Override // android.graphics.drawable.Drawable
        public void setAlpha(int i) {
            this.paint.setAlpha(i);
        }

        @Override // android.graphics.drawable.Drawable
        public void setColorFilter(ColorFilter colorFilter) {
            this.paint.setColorFilter(colorFilter);
        }
    }

    public CircleBitmapDisplayer() {
        this(null);
    }

    @Override // com.nostra13.universalimageloader.core.display.BitmapDisplayer
    public void display(Bitmap bitmap, ImageAware imageAware, LoadedFrom loadedFrom) {
        if (imageAware instanceof ImageViewAware) {
            imageAware.setImageDrawable(new CircleDrawable(bitmap, this.strokeColor, this.strokeWidth));
            return;
        }
        throw new IllegalArgumentException("ImageAware should wrap ImageView. ImageViewAware is expected.");
    }

    public CircleBitmapDisplayer(Integer num) {
        this(num, 0.0f);
    }

    public CircleBitmapDisplayer(Integer num, float f) {
        this.strokeColor = num;
        this.strokeWidth = f;
    }
}

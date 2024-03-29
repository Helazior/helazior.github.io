package com.nineoldandroids.view.animation;

import android.graphics.Camera;
import android.graphics.Matrix;
import android.graphics.RectF;
import android.os.Build;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Transformation;
import java.lang.ref.WeakReference;
import java.util.WeakHashMap;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class AnimatorProxy extends Animation {
    public static final boolean NEEDS_PROXY;
    private static final WeakHashMap<View, AnimatorProxy> PROXIES;
    private boolean mHasPivot;
    private float mPivotX;
    private float mPivotY;
    private float mRotationX;
    private float mRotationY;
    private float mRotationZ;
    private float mTranslationX;
    private float mTranslationY;
    private final WeakReference<View> mView;
    private final Camera mCamera = new Camera();
    private float mAlpha = 1.0f;
    private float mScaleX = 1.0f;
    private float mScaleY = 1.0f;
    private final RectF mBefore = new RectF();
    private final RectF mAfter = new RectF();
    private final Matrix mTempMatrix = new Matrix();

    static {
        NEEDS_PROXY = Integer.valueOf(Build.VERSION.SDK).intValue() < 11;
        PROXIES = new WeakHashMap<>();
    }

    private AnimatorProxy(View view) {
        setDuration(0L);
        setFillAfter(true);
        view.setAnimation(this);
        this.mView = new WeakReference<>(view);
    }

    private void computeRect(RectF rectF, View view) {
        rectF.set(0.0f, 0.0f, view.getWidth(), view.getHeight());
        Matrix matrix = this.mTempMatrix;
        matrix.reset();
        transformMatrix(matrix, view);
        this.mTempMatrix.mapRect(rectF);
        rectF.offset(view.getLeft(), view.getTop());
        float f = rectF.right;
        float f2 = rectF.left;
        if (f < f2) {
            rectF.right = f2;
            rectF.left = f;
        }
        float f3 = rectF.bottom;
        float f4 = rectF.top;
        if (f3 < f4) {
            rectF.top = f3;
            rectF.bottom = f4;
        }
    }

    private void invalidateAfterUpdate() {
        View view = this.mView.get();
        if (view == null || view.getParent() == null) {
            return;
        }
        RectF rectF = this.mAfter;
        computeRect(rectF, view);
        rectF.union(this.mBefore);
        ((View) view.getParent()).invalidate((int) Math.floor(rectF.left), (int) Math.floor(rectF.top), (int) Math.ceil(rectF.right), (int) Math.ceil(rectF.bottom));
    }

    private void prepareForUpdate() {
        View view = this.mView.get();
        if (view != null) {
            computeRect(this.mBefore, view);
        }
    }

    private void transformMatrix(Matrix matrix, View view) {
        float width = view.getWidth();
        float height = view.getHeight();
        boolean z = this.mHasPivot;
        float f = z ? this.mPivotX : width / 2.0f;
        float f2 = z ? this.mPivotY : height / 2.0f;
        float f3 = this.mRotationX;
        float f4 = this.mRotationY;
        float f5 = this.mRotationZ;
        if (f3 != 0.0f || f4 != 0.0f || f5 != 0.0f) {
            Camera camera = this.mCamera;
            camera.save();
            camera.rotateX(f3);
            camera.rotateY(f4);
            camera.rotateZ(-f5);
            camera.getMatrix(matrix);
            camera.restore();
            matrix.preTranslate(-f, -f2);
            matrix.postTranslate(f, f2);
        }
        float f6 = this.mScaleX;
        float f7 = this.mScaleY;
        if (f6 != 1.0f || f7 != 1.0f) {
            matrix.postScale(f6, f7);
            matrix.postTranslate(((f6 * width) - width) * (-(f / width)), ((f7 * height) - height) * (-(f2 / height)));
        }
        matrix.postTranslate(this.mTranslationX, this.mTranslationY);
    }

    public static AnimatorProxy wrap(View view) {
        WeakHashMap<View, AnimatorProxy> weakHashMap = PROXIES;
        AnimatorProxy animatorProxy = weakHashMap.get(view);
        if (animatorProxy == null || animatorProxy != view.getAnimation()) {
            AnimatorProxy animatorProxy2 = new AnimatorProxy(view);
            weakHashMap.put(view, animatorProxy2);
            return animatorProxy2;
        }
        return animatorProxy;
    }

    @Override // android.view.animation.Animation
    public void applyTransformation(float f, Transformation transformation) {
        View view = this.mView.get();
        if (view != null) {
            transformation.setAlpha(this.mAlpha);
            transformMatrix(transformation.getMatrix(), view);
        }
    }

    public float getAlpha() {
        return this.mAlpha;
    }

    public float getPivotX() {
        return this.mPivotX;
    }

    public float getPivotY() {
        return this.mPivotY;
    }

    public float getRotation() {
        return this.mRotationZ;
    }

    public float getRotationX() {
        return this.mRotationX;
    }

    public float getRotationY() {
        return this.mRotationY;
    }

    public float getScaleX() {
        return this.mScaleX;
    }

    public float getScaleY() {
        return this.mScaleY;
    }

    public int getScrollX() {
        View view = this.mView.get();
        if (view == null) {
            return 0;
        }
        return view.getScrollX();
    }

    public int getScrollY() {
        View view = this.mView.get();
        if (view == null) {
            return 0;
        }
        return view.getScrollY();
    }

    public float getTranslationX() {
        return this.mTranslationX;
    }

    public float getTranslationY() {
        return this.mTranslationY;
    }

    public float getX() {
        View view = this.mView.get();
        if (view == null) {
            return 0.0f;
        }
        return view.getLeft() + this.mTranslationX;
    }

    public float getY() {
        View view = this.mView.get();
        if (view == null) {
            return 0.0f;
        }
        return view.getTop() + this.mTranslationY;
    }

    public void setAlpha(float f) {
        if (this.mAlpha != f) {
            this.mAlpha = f;
            View view = this.mView.get();
            if (view != null) {
                view.invalidate();
            }
        }
    }

    public void setPivotX(float f) {
        if (this.mHasPivot && this.mPivotX == f) {
            return;
        }
        prepareForUpdate();
        this.mHasPivot = true;
        this.mPivotX = f;
        invalidateAfterUpdate();
    }

    public void setPivotY(float f) {
        if (this.mHasPivot && this.mPivotY == f) {
            return;
        }
        prepareForUpdate();
        this.mHasPivot = true;
        this.mPivotY = f;
        invalidateAfterUpdate();
    }

    public void setRotation(float f) {
        if (this.mRotationZ != f) {
            prepareForUpdate();
            this.mRotationZ = f;
            invalidateAfterUpdate();
        }
    }

    public void setRotationX(float f) {
        if (this.mRotationX != f) {
            prepareForUpdate();
            this.mRotationX = f;
            invalidateAfterUpdate();
        }
    }

    public void setRotationY(float f) {
        if (this.mRotationY != f) {
            prepareForUpdate();
            this.mRotationY = f;
            invalidateAfterUpdate();
        }
    }

    public void setScaleX(float f) {
        if (this.mScaleX != f) {
            prepareForUpdate();
            this.mScaleX = f;
            invalidateAfterUpdate();
        }
    }

    public void setScaleY(float f) {
        if (this.mScaleY != f) {
            prepareForUpdate();
            this.mScaleY = f;
            invalidateAfterUpdate();
        }
    }

    public void setScrollX(int i) {
        View view = this.mView.get();
        if (view != null) {
            view.scrollTo(i, view.getScrollY());
        }
    }

    public void setScrollY(int i) {
        View view = this.mView.get();
        if (view != null) {
            view.scrollTo(view.getScrollX(), i);
        }
    }

    public void setTranslationX(float f) {
        if (this.mTranslationX != f) {
            prepareForUpdate();
            this.mTranslationX = f;
            invalidateAfterUpdate();
        }
    }

    public void setTranslationY(float f) {
        if (this.mTranslationY != f) {
            prepareForUpdate();
            this.mTranslationY = f;
            invalidateAfterUpdate();
        }
    }

    public void setX(float f) {
        View view = this.mView.get();
        if (view != null) {
            setTranslationX(f - view.getLeft());
        }
    }

    public void setY(float f) {
        View view = this.mView.get();
        if (view != null) {
            setTranslationY(f - view.getTop());
        }
    }
}

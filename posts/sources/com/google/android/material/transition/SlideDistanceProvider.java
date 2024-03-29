package com.google.android.material.transition;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import com.google.android.material.C1103R;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.concurrent.atomic.AtomicInteger;
import p000.C0492V4;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class SlideDistanceProvider implements VisibilityAnimatorProvider {
    private static final int DEFAULT_DISTANCE = -1;
    private int slideDistance = -1;
    private int slideEdge;

    @Retention(RetentionPolicy.SOURCE)
    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public @interface GravityFlag {
    }

    public SlideDistanceProvider(int i) {
        this.slideEdge = i;
    }

    private static Animator createTranslationAppearAnimator(View view, View view2, int i, int i2) {
        float translationX = view2.getTranslationX();
        float translationY = view2.getTranslationY();
        if (i != 3) {
            if (i != 5) {
                if (i != 48) {
                    if (i != 80) {
                        if (i == 8388611) {
                            return createTranslationXAnimator(view2, isRtl(view) ? i2 + translationX : translationX - i2, translationX, translationX);
                        } else if (i == 8388613) {
                            return createTranslationXAnimator(view2, isRtl(view) ? translationX - i2 : i2 + translationX, translationX, translationX);
                        } else {
                            throw new IllegalArgumentException(outline.m273H("Invalid slide direction: ", i));
                        }
                    }
                    return createTranslationYAnimator(view2, i2 + translationY, translationY, translationY);
                }
                return createTranslationYAnimator(view2, translationY - i2, translationY, translationY);
            }
            return createTranslationXAnimator(view2, translationX - i2, translationX, translationX);
        }
        return createTranslationXAnimator(view2, i2 + translationX, translationX, translationX);
    }

    private static Animator createTranslationDisappearAnimator(View view, View view2, int i, int i2) {
        float translationX = view2.getTranslationX();
        float translationY = view2.getTranslationY();
        if (i != 3) {
            if (i != 5) {
                if (i != 48) {
                    if (i != 80) {
                        if (i == 8388611) {
                            return createTranslationXAnimator(view2, translationX, isRtl(view) ? translationX - i2 : i2 + translationX, translationX);
                        } else if (i == 8388613) {
                            return createTranslationXAnimator(view2, translationX, isRtl(view) ? i2 + translationX : translationX - i2, translationX);
                        } else {
                            throw new IllegalArgumentException(outline.m273H("Invalid slide direction: ", i));
                        }
                    }
                    return createTranslationYAnimator(view2, translationY, translationY - i2, translationY);
                }
                return createTranslationYAnimator(view2, translationY, i2 + translationY, translationY);
            }
            return createTranslationXAnimator(view2, translationX, i2 + translationX, translationX);
        }
        return createTranslationXAnimator(view2, translationX, translationX - i2, translationX);
    }

    private static Animator createTranslationXAnimator(final View view, float f, float f2, final float f3) {
        ObjectAnimator ofPropertyValuesHolder = ObjectAnimator.ofPropertyValuesHolder(view, PropertyValuesHolder.ofFloat(View.TRANSLATION_X, f, f2));
        ofPropertyValuesHolder.addListener(new AnimatorListenerAdapter() { // from class: com.google.android.material.transition.SlideDistanceProvider.1
            @Override // android.animation.AnimatorListenerAdapter, android.animation.Animator.AnimatorListener
            public void onAnimationEnd(Animator animator) {
                view.setTranslationX(f3);
            }
        });
        return ofPropertyValuesHolder;
    }

    private static Animator createTranslationYAnimator(final View view, float f, float f2, final float f3) {
        ObjectAnimator ofPropertyValuesHolder = ObjectAnimator.ofPropertyValuesHolder(view, PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, f, f2));
        ofPropertyValuesHolder.addListener(new AnimatorListenerAdapter() { // from class: com.google.android.material.transition.SlideDistanceProvider.2
            @Override // android.animation.AnimatorListenerAdapter, android.animation.Animator.AnimatorListener
            public void onAnimationEnd(Animator animator) {
                view.setTranslationY(f3);
            }
        });
        return ofPropertyValuesHolder;
    }

    private int getSlideDistanceOrDefault(Context context) {
        int i = this.slideDistance;
        return i != -1 ? i : context.getResources().getDimensionPixelSize(C1103R.dimen.mtrl_transition_shared_axis_slide_distance);
    }

    private static boolean isRtl(View view) {
        AtomicInteger atomicInteger = C0492V4.f1798a;
        return C0492V4.C0496d.m1921d(view) == 1;
    }

    @Override // com.google.android.material.transition.VisibilityAnimatorProvider
    public Animator createAppear(ViewGroup viewGroup, View view) {
        return createTranslationAppearAnimator(viewGroup, view, this.slideEdge, getSlideDistanceOrDefault(view.getContext()));
    }

    @Override // com.google.android.material.transition.VisibilityAnimatorProvider
    public Animator createDisappear(ViewGroup viewGroup, View view) {
        return createTranslationDisappearAnimator(viewGroup, view, this.slideEdge, getSlideDistanceOrDefault(view.getContext()));
    }

    public int getSlideDistance() {
        return this.slideDistance;
    }

    public int getSlideEdge() {
        return this.slideEdge;
    }

    public void setSlideDistance(int i) {
        if (i >= 0) {
            this.slideDistance = i;
            return;
        }
        throw new IllegalArgumentException("Slide distance must be positive. If attempting to reverse the direction of the slide, use setSlideEdge(int) instead.");
    }

    public void setSlideEdge(int i) {
        this.slideEdge = i;
    }
}

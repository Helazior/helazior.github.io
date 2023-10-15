package com.bumptech.glide.load.resource.drawable;

import android.graphics.drawable.Drawable;
import com.bumptech.glide.TransitionOptions;
import com.bumptech.glide.request.transition.DrawableCrossFadeFactory;
import com.bumptech.glide.request.transition.TransitionFactory;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class DrawableTransitionOptions extends TransitionOptions<DrawableTransitionOptions, Drawable> {
    public static DrawableTransitionOptions with(TransitionFactory<Drawable> transitionFactory) {
        return new DrawableTransitionOptions().transition(transitionFactory);
    }

    public static DrawableTransitionOptions withCrossFade() {
        return new DrawableTransitionOptions().crossFade();
    }

    public DrawableTransitionOptions crossFade() {
        return crossFade(new DrawableCrossFadeFactory.Builder());
    }

    public static DrawableTransitionOptions withCrossFade(int i) {
        return new DrawableTransitionOptions().crossFade(i);
    }

    public DrawableTransitionOptions crossFade(int i) {
        return crossFade(new DrawableCrossFadeFactory.Builder(i));
    }

    public static DrawableTransitionOptions withCrossFade(DrawableCrossFadeFactory drawableCrossFadeFactory) {
        return new DrawableTransitionOptions().crossFade(drawableCrossFadeFactory);
    }

    public DrawableTransitionOptions crossFade(DrawableCrossFadeFactory drawableCrossFadeFactory) {
        return transition(drawableCrossFadeFactory);
    }

    public static DrawableTransitionOptions withCrossFade(DrawableCrossFadeFactory.Builder builder) {
        return new DrawableTransitionOptions().crossFade(builder);
    }

    public DrawableTransitionOptions crossFade(DrawableCrossFadeFactory.Builder builder) {
        return crossFade(builder.build());
    }
}

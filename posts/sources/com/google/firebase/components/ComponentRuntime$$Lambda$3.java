package com.google.firebase.components;

import com.google.firebase.inject.Provider;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final /* synthetic */ class ComponentRuntime$$Lambda$3 implements Runnable {
    private final OptionalProvider arg$1;
    private final Provider arg$2;

    private ComponentRuntime$$Lambda$3(OptionalProvider optionalProvider, Provider provider) {
        this.arg$1 = optionalProvider;
        this.arg$2 = provider;
    }

    public static Runnable lambdaFactory$(OptionalProvider optionalProvider, Provider provider) {
        return new ComponentRuntime$$Lambda$3(optionalProvider, provider);
    }

    @Override // java.lang.Runnable
    public void run() {
        this.arg$1.set(this.arg$2);
    }
}

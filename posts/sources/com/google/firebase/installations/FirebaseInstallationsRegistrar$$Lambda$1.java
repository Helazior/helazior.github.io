package com.google.firebase.installations;

import com.google.firebase.components.ComponentContainer;
import com.google.firebase.components.ComponentFactory;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final /* synthetic */ class FirebaseInstallationsRegistrar$$Lambda$1 implements ComponentFactory {
    private static final FirebaseInstallationsRegistrar$$Lambda$1 instance = new FirebaseInstallationsRegistrar$$Lambda$1();

    private FirebaseInstallationsRegistrar$$Lambda$1() {
    }

    @Override // com.google.firebase.components.ComponentFactory
    public Object create(ComponentContainer componentContainer) {
        return FirebaseInstallationsRegistrar.lambda$getComponents$0(componentContainer);
    }
}

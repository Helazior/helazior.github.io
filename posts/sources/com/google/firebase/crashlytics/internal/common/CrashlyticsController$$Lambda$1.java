package com.google.firebase.crashlytics.internal.common;

import java.io.File;
import java.io.FilenameFilter;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final /* synthetic */ class CrashlyticsController$$Lambda$1 implements FilenameFilter {
    private static final CrashlyticsController$$Lambda$1 instance = new CrashlyticsController$$Lambda$1();

    private CrashlyticsController$$Lambda$1() {
    }

    @Override // java.io.FilenameFilter
    public boolean accept(File file, String str) {
        return CrashlyticsController.lambda$static$0(file, str);
    }
}

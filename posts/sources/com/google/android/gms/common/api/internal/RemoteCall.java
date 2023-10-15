package com.google.android.gms.common.api.internal;

import com.google.android.gms.common.annotation.KeepForSdk;

@KeepForSdk
/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public interface RemoteCall<T, U> {
    @KeepForSdk
    void accept(T t, U u);
}

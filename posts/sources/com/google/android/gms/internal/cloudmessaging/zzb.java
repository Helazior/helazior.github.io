package com.google.android.gms.internal.cloudmessaging;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadFactory;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public interface zzb {
    ExecutorService zza(ThreadFactory threadFactory, int i);

    ScheduledExecutorService zza(int i, ThreadFactory threadFactory, int i2);
}

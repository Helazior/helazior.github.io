package com.google.android.gms.stats;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class zzb implements Runnable {
    private final /* synthetic */ WakeLock zzp;

    public zzb(WakeLock wakeLock) {
        this.zzp = wakeLock;
    }

    @Override // java.lang.Runnable
    public final void run() {
        this.zzp.zza(0);
    }
}

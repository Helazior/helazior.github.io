package com.google.android.gms.cloudmessaging;

import android.os.Bundle;
import android.util.Log;
import com.google.android.gms.tasks.TaskCompletionSource;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class zzq<T> {
    public final int zza;
    public final TaskCompletionSource<T> zzb = new TaskCompletionSource<>();
    public final int zzc;
    public final Bundle zzd;

    public zzq(int i, int i2, Bundle bundle) {
        this.zza = i;
        this.zzc = i2;
        this.zzd = bundle;
    }

    public String toString() {
        int i = this.zzc;
        int i2 = this.zza;
        boolean zza = zza();
        StringBuilder sb = new StringBuilder(55);
        sb.append("Request { what=");
        sb.append(i);
        sb.append(" id=");
        sb.append(i2);
        sb.append(" oneWay=");
        sb.append(zza);
        sb.append("}");
        return sb.toString();
    }

    public abstract void zza(Bundle bundle);

    public final void zza(T t) {
        if (Log.isLoggable("MessengerIpcClient", 3)) {
            String valueOf = String.valueOf(this);
            String valueOf2 = String.valueOf(t);
            StringBuilder sb = new StringBuilder(valueOf2.length() + valueOf.length() + 16);
            sb.append("Finishing ");
            sb.append(valueOf);
            sb.append(" with ");
            sb.append(valueOf2);
            Log.d("MessengerIpcClient", sb.toString());
        }
        this.zzb.setResult(t);
    }

    public abstract boolean zza();

    public final void zza(zzp zzpVar) {
        if (Log.isLoggable("MessengerIpcClient", 3)) {
            String valueOf = String.valueOf(this);
            String valueOf2 = String.valueOf(zzpVar);
            StringBuilder sb = new StringBuilder(valueOf2.length() + valueOf.length() + 14);
            sb.append("Failing ");
            sb.append(valueOf);
            sb.append(" with ");
            sb.append(valueOf2);
            Log.d("MessengerIpcClient", sb.toString());
        }
        this.zzb.setException(zzpVar);
    }
}

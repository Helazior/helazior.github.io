package com.google.android.gms.common.internal;

import android.os.IBinder;
import android.os.Parcel;
import com.google.android.gms.dynamic.IObjectWrapper;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class zzad extends com.google.android.gms.internal.common.zza implements zzaf {
    public zzad(IBinder iBinder) {
        super(iBinder, "com.google.android.gms.common.internal.IGoogleCertificatesApi");
    }

    @Override // com.google.android.gms.common.internal.zzaf
    public final com.google.android.gms.common.zzq zze(com.google.android.gms.common.zzn zznVar) {
        Parcel zza = zza();
        com.google.android.gms.internal.common.zzc.zzc(zza, zznVar);
        Parcel zzB = zzB(6, zza);
        com.google.android.gms.common.zzq zzqVar = (com.google.android.gms.common.zzq) com.google.android.gms.internal.common.zzc.zza(zzB, com.google.android.gms.common.zzq.CREATOR);
        zzB.recycle();
        return zzqVar;
    }

    @Override // com.google.android.gms.common.internal.zzaf
    public final boolean zzf(com.google.android.gms.common.zzs zzsVar, IObjectWrapper iObjectWrapper) {
        Parcel zza = zza();
        com.google.android.gms.internal.common.zzc.zzc(zza, zzsVar);
        com.google.android.gms.internal.common.zzc.zze(zza, iObjectWrapper);
        Parcel zzB = zzB(5, zza);
        boolean zzf = com.google.android.gms.internal.common.zzc.zzf(zzB);
        zzB.recycle();
        return zzf;
    }

    @Override // com.google.android.gms.common.internal.zzaf
    public final boolean zzg() {
        Parcel zzB = zzB(7, zza());
        boolean zzf = com.google.android.gms.internal.common.zzc.zzf(zzB);
        zzB.recycle();
        return zzf;
    }
}

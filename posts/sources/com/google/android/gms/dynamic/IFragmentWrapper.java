package com.google.android.gms.dynamic;

import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import com.google.android.gms.dynamic.IObjectWrapper;
import com.google.android.gms.internal.common.zzc;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public interface IFragmentWrapper extends IInterface {

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static abstract class Stub extends com.google.android.gms.internal.common.zzb implements IFragmentWrapper {
        public Stub() {
            super("com.google.android.gms.dynamic.IFragmentWrapper");
        }

        public static IFragmentWrapper asInterface(IBinder iBinder) {
            if (iBinder == null) {
                return null;
            }
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.google.android.gms.dynamic.IFragmentWrapper");
            return queryLocalInterface instanceof IFragmentWrapper ? (IFragmentWrapper) queryLocalInterface : new zza(iBinder);
        }

        @Override // com.google.android.gms.internal.common.zzb
        public final boolean zza(int i, Parcel parcel, Parcel parcel2, int i2) {
            switch (i) {
                case 2:
                    IObjectWrapper zzg = zzg();
                    parcel2.writeNoException();
                    zzc.zze(parcel2, zzg);
                    return true;
                case 3:
                    Bundle zzd = zzd();
                    parcel2.writeNoException();
                    zzc.zzd(parcel2, zzd);
                    return true;
                case 4:
                    int zzb = zzb();
                    parcel2.writeNoException();
                    parcel2.writeInt(zzb);
                    return true;
                case 5:
                    IFragmentWrapper zze = zze();
                    parcel2.writeNoException();
                    zzc.zze(parcel2, zze);
                    return true;
                case 6:
                    IObjectWrapper zzh = zzh();
                    parcel2.writeNoException();
                    zzc.zze(parcel2, zzh);
                    return true;
                case 7:
                    boolean zzs = zzs();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzs);
                    return true;
                case 8:
                    String zzj = zzj();
                    parcel2.writeNoException();
                    parcel2.writeString(zzj);
                    return true;
                case 9:
                    IFragmentWrapper zzf = zzf();
                    parcel2.writeNoException();
                    zzc.zze(parcel2, zzf);
                    return true;
                case 10:
                    int zzc = zzc();
                    parcel2.writeNoException();
                    parcel2.writeInt(zzc);
                    return true;
                case 11:
                    boolean zzt = zzt();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzt);
                    return true;
                case 12:
                    IObjectWrapper zzi = zzi();
                    parcel2.writeNoException();
                    zzc.zze(parcel2, zzi);
                    return true;
                case 13:
                    boolean zzu = zzu();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzu);
                    return true;
                case 14:
                    boolean zzv = zzv();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzv);
                    return true;
                case 15:
                    boolean zzw = zzw();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzw);
                    return true;
                case 16:
                    boolean zzx = zzx();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzx);
                    return true;
                case 17:
                    boolean zzy = zzy();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzy);
                    return true;
                case 18:
                    boolean zzz = zzz();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzz);
                    return true;
                case 19:
                    boolean zzA = zzA();
                    parcel2.writeNoException();
                    zzc.zzb(parcel2, zzA);
                    return true;
                case 20:
                    zzk(IObjectWrapper.Stub.asInterface(parcel.readStrongBinder()));
                    parcel2.writeNoException();
                    return true;
                case 21:
                    zzl(zzc.zzf(parcel));
                    parcel2.writeNoException();
                    return true;
                case 22:
                    zzm(zzc.zzf(parcel));
                    parcel2.writeNoException();
                    return true;
                case 23:
                    zzn(zzc.zzf(parcel));
                    parcel2.writeNoException();
                    return true;
                case 24:
                    zzo(zzc.zzf(parcel));
                    parcel2.writeNoException();
                    return true;
                case 25:
                    zzp((Intent) zzc.zza(parcel, Intent.CREATOR));
                    parcel2.writeNoException();
                    return true;
                case 26:
                    zzq((Intent) zzc.zza(parcel, Intent.CREATOR), parcel.readInt());
                    parcel2.writeNoException();
                    return true;
                case 27:
                    zzr(IObjectWrapper.Stub.asInterface(parcel.readStrongBinder()));
                    parcel2.writeNoException();
                    return true;
                default:
                    return false;
            }
        }
    }

    boolean zzA();

    int zzb();

    int zzc();

    Bundle zzd();

    IFragmentWrapper zze();

    IFragmentWrapper zzf();

    IObjectWrapper zzg();

    IObjectWrapper zzh();

    IObjectWrapper zzi();

    String zzj();

    void zzk(IObjectWrapper iObjectWrapper);

    void zzl(boolean z);

    void zzm(boolean z);

    void zzn(boolean z);

    void zzo(boolean z);

    void zzp(Intent intent);

    void zzq(Intent intent, int i);

    void zzr(IObjectWrapper iObjectWrapper);

    boolean zzs();

    boolean zzt();

    boolean zzu();

    boolean zzv();

    boolean zzw();

    boolean zzx();

    boolean zzy();

    boolean zzz();
}

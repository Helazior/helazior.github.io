package com.google.android.gms.dynamite;

import android.content.Context;
import com.google.android.gms.dynamite.DynamiteModule;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class zzl implements DynamiteModule.VersionPolicy {
    @Override // com.google.android.gms.dynamite.DynamiteModule.VersionPolicy
    public final DynamiteModule.VersionPolicy.SelectionResult selectModule(Context context, String str, DynamiteModule.VersionPolicy.IVersions iVersions) {
        int zzb;
        DynamiteModule.VersionPolicy.SelectionResult selectionResult = new DynamiteModule.VersionPolicy.SelectionResult();
        int zza = iVersions.zza(context, str);
        selectionResult.localVersion = zza;
        int i = 0;
        if (zza != 0) {
            zzb = iVersions.zzb(context, str, false);
            selectionResult.remoteVersion = zzb;
        } else {
            zzb = iVersions.zzb(context, str, true);
            selectionResult.remoteVersion = zzb;
        }
        int i2 = selectionResult.localVersion;
        if (i2 != 0) {
            i = i2;
        } else if (zzb == 0) {
            selectionResult.selection = 0;
            return selectionResult;
        }
        if (zzb >= i) {
            selectionResult.selection = 1;
        } else {
            selectionResult.selection = -1;
        }
        return selectionResult;
    }
}

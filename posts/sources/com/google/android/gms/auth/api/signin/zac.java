package com.google.android.gms.auth.api.signin;

import com.google.android.gms.common.api.Scope;
import java.util.Comparator;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class zac implements Comparator<Scope> {
    @Override // java.util.Comparator
    public final /* bridge */ /* synthetic */ int compare(Scope scope, Scope scope2) {
        return scope.getScopeUri().compareTo(scope2.getScopeUri());
    }
}

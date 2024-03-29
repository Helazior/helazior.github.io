package com.google.firebase.platforminfo;

import android.content.Context;
import com.google.firebase.components.Component;
import com.google.firebase.components.Dependency;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class LibraryVersionComponent {

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public interface VersionExtractor<T> {
        String extract(T t);
    }

    private LibraryVersionComponent() {
    }

    public static Component<?> create(String str, String str2) {
        return Component.intoSet(LibraryVersion.create(str, str2), LibraryVersion.class);
    }

    public static Component<?> fromContext(String str, VersionExtractor<Context> versionExtractor) {
        return Component.intoSetBuilder(LibraryVersion.class).add(Dependency.required(Context.class)).factory(LibraryVersionComponent$$Lambda$1.lambdaFactory$(str, versionExtractor)).build();
    }
}

package com.google.firebase.platforminfo;

import java.util.Objects;
import javax.annotation.Nonnull;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class AutoValue_LibraryVersion extends LibraryVersion {
    private final String libraryName;
    private final String version;

    public AutoValue_LibraryVersion(String str, String str2) {
        Objects.requireNonNull(str, "Null libraryName");
        this.libraryName = str;
        Objects.requireNonNull(str2, "Null version");
        this.version = str2;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof LibraryVersion) {
            LibraryVersion libraryVersion = (LibraryVersion) obj;
            return this.libraryName.equals(libraryVersion.getLibraryName()) && this.version.equals(libraryVersion.getVersion());
        }
        return false;
    }

    @Override // com.google.firebase.platforminfo.LibraryVersion
    @Nonnull
    public String getLibraryName() {
        return this.libraryName;
    }

    @Override // com.google.firebase.platforminfo.LibraryVersion
    @Nonnull
    public String getVersion() {
        return this.version;
    }

    public int hashCode() {
        return ((this.libraryName.hashCode() ^ 1000003) * 1000003) ^ this.version.hashCode();
    }

    public String toString() {
        StringBuilder m253r = outline.m253r("LibraryVersion{libraryName=");
        m253r.append(this.libraryName);
        m253r.append(", version=");
        return outline.m262i(m253r, this.version, "}");
    }
}

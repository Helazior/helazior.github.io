package org.spongycastle.crypto.tls;

import java.util.Vector;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CertificateRequest {
    private Vector certificateAuthorities;
    private short[] certificateTypes;

    public CertificateRequest(short[] sArr, Vector vector) {
        this.certificateTypes = sArr;
        this.certificateAuthorities = vector;
    }

    public Vector getCertificateAuthorities() {
        return this.certificateAuthorities;
    }

    public short[] getCertificateTypes() {
        return this.certificateTypes;
    }
}

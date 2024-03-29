package com.google.zxing.oned.rss.expanded.decoders;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class DecodedInformation extends DecodedObject {
    private final String newString;
    private final boolean remaining;
    private final int remainingValue;

    public DecodedInformation(int i, String str) {
        super(i);
        this.newString = str;
        this.remaining = false;
        this.remainingValue = 0;
    }

    public String getNewString() {
        return this.newString;
    }

    public int getRemainingValue() {
        return this.remainingValue;
    }

    public boolean isRemaining() {
        return this.remaining;
    }

    public DecodedInformation(int i, String str, int i2) {
        super(i);
        this.remaining = true;
        this.remainingValue = i2;
        this.newString = str;
    }
}

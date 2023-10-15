package com.google.zxing.oned.rss.expanded;

import java.util.ArrayList;
import java.util.List;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class ExpandedRow {
    private final List<ExpandedPair> pairs;
    private final int rowNumber;
    private final boolean wasReversed;

    public ExpandedRow(List<ExpandedPair> list, int i, boolean z) {
        this.pairs = new ArrayList(list);
        this.rowNumber = i;
        this.wasReversed = z;
    }

    public boolean equals(Object obj) {
        if (obj instanceof ExpandedRow) {
            ExpandedRow expandedRow = (ExpandedRow) obj;
            return this.pairs.equals(expandedRow.getPairs()) && this.wasReversed == expandedRow.wasReversed;
        }
        return false;
    }

    public List<ExpandedPair> getPairs() {
        return this.pairs;
    }

    public int getRowNumber() {
        return this.rowNumber;
    }

    public int hashCode() {
        return this.pairs.hashCode() ^ Boolean.valueOf(this.wasReversed).hashCode();
    }

    public boolean isEquivalent(List<ExpandedPair> list) {
        return this.pairs.equals(list);
    }

    public boolean isReversed() {
        return this.wasReversed;
    }

    public String toString() {
        StringBuilder m253r = outline.m253r("{ ");
        m253r.append(this.pairs);
        m253r.append(" }");
        return m253r.toString();
    }
}

package com.google.zxing.client.result;

import java.util.regex.Pattern;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class URIParsedResult extends ParsedResult {
    private static final Pattern USER_IN_HOST = Pattern.compile(":/*([^/@]+)@[^/]+");
    private final String title;
    private final String uri;

    public URIParsedResult(String str, String str2) {
        super(ParsedResultType.URI);
        this.uri = massageURI(str);
        this.title = str2;
    }

    private static boolean isColonFollowedByPortNumber(String str, int i) {
        int i2 = i + 1;
        int indexOf = str.indexOf(47, i2);
        if (indexOf < 0) {
            indexOf = str.length();
        }
        if (indexOf <= i2) {
            return false;
        }
        while (i2 < indexOf) {
            if (str.charAt(i2) < '0' || str.charAt(i2) > '9') {
                return false;
            }
            i2++;
        }
        return true;
    }

    private static String massageURI(String str) {
        String trim = str.trim();
        int indexOf = trim.indexOf(58);
        if (indexOf < 0) {
            return outline.m266e("http://", trim);
        }
        return isColonFollowedByPortNumber(trim, indexOf) ? outline.m266e("http://", trim) : trim;
    }

    @Override // com.google.zxing.client.result.ParsedResult
    public String getDisplayResult() {
        StringBuilder sb = new StringBuilder(30);
        ParsedResult.maybeAppend(this.title, sb);
        ParsedResult.maybeAppend(this.uri, sb);
        return sb.toString();
    }

    public String getTitle() {
        return this.title;
    }

    public String getURI() {
        return this.uri;
    }

    public boolean isPossiblyMaliciousURI() {
        return USER_IN_HOST.matcher(this.uri).find();
    }
}

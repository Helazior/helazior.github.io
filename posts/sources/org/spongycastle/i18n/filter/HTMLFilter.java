package org.spongycastle.i18n.filter;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class HTMLFilter implements Filter {
    @Override // org.spongycastle.i18n.filter.Filter
    public String doFilter(String str) {
        StringBuffer stringBuffer = new StringBuffer(str);
        int i = 0;
        while (i < stringBuffer.length()) {
            char charAt = stringBuffer.charAt(i);
            if (charAt == '\"') {
                stringBuffer.replace(i, i + 1, "&#34");
            } else if (charAt == '#') {
                stringBuffer.replace(i, i + 1, "&#35");
            } else if (charAt == '+') {
                stringBuffer.replace(i, i + 1, "&#43");
            } else if (charAt == '-') {
                stringBuffer.replace(i, i + 1, "&#45");
            } else if (charAt == '>') {
                stringBuffer.replace(i, i + 1, "&#62");
            } else if (charAt == ';') {
                stringBuffer.replace(i, i + 1, "&#59");
            } else if (charAt != '<') {
                switch (charAt) {
                    case '%':
                        stringBuffer.replace(i, i + 1, "&#37");
                        continue;
                    case '&':
                        stringBuffer.replace(i, i + 1, "&#38");
                        continue;
                    case '\'':
                        stringBuffer.replace(i, i + 1, "&#39");
                        continue;
                    case '(':
                        stringBuffer.replace(i, i + 1, "&#40");
                        continue;
                    case ')':
                        stringBuffer.replace(i, i + 1, "&#41");
                        continue;
                    default:
                        i -= 3;
                        continue;
                }
            } else {
                stringBuffer.replace(i, i + 1, "&#60");
            }
            i += 4;
        }
        return stringBuffer.toString();
    }

    @Override // org.spongycastle.i18n.filter.Filter
    public String doFilterUrl(String str) {
        return doFilter(str);
    }
}

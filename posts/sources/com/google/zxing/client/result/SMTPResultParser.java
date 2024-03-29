package com.google.zxing.client.result;

import com.google.zxing.Result;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class SMTPResultParser extends ResultParser {
    @Override // com.google.zxing.client.result.ResultParser
    public EmailAddressParsedResult parse(Result result) {
        String str;
        String massagedText = ResultParser.getMassagedText(result);
        String str2 = null;
        if (massagedText.startsWith("smtp:") || massagedText.startsWith("SMTP:")) {
            String substring = massagedText.substring(5);
            int indexOf = substring.indexOf(58);
            if (indexOf >= 0) {
                String substring2 = substring.substring(indexOf + 1);
                substring = substring.substring(0, indexOf);
                int indexOf2 = substring2.indexOf(58);
                if (indexOf2 >= 0) {
                    String substring3 = substring2.substring(indexOf2 + 1);
                    str2 = substring2.substring(0, indexOf2);
                    str = substring3;
                } else {
                    str = null;
                    str2 = substring2;
                }
            } else {
                str = null;
            }
            return new EmailAddressParsedResult(substring, str2, str, outline.m266e("mailto:", substring));
        }
        return null;
    }
}

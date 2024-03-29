package com.google.zxing.client.result;

import com.google.zxing.Result;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class WifiResultParser extends ResultParser {
    @Override // com.google.zxing.client.result.ResultParser
    public WifiParsedResult parse(Result result) {
        String matchSinglePrefixedField;
        String massagedText = ResultParser.getMassagedText(result);
        if (!massagedText.startsWith("WIFI:") || (matchSinglePrefixedField = ResultParser.matchSinglePrefixedField("S:", massagedText, ';', false)) == null || matchSinglePrefixedField.length() == 0) {
            return null;
        }
        String matchSinglePrefixedField2 = ResultParser.matchSinglePrefixedField("P:", massagedText, ';', false);
        String matchSinglePrefixedField3 = ResultParser.matchSinglePrefixedField("T:", massagedText, ';', false);
        if (matchSinglePrefixedField3 == null) {
            matchSinglePrefixedField3 = "nopass";
        }
        return new WifiParsedResult(matchSinglePrefixedField3, matchSinglePrefixedField, matchSinglePrefixedField2, Boolean.parseBoolean(ResultParser.matchSinglePrefixedField("H:", massagedText, ';', false)));
    }
}

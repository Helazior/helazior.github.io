package org.kxml2.wap.syncml;

import org.ksoap2.serialization.MarshalHashtable;
import org.kxml2.wap.WbxmlParser;
import org.kxml2.wap.WbxmlSerializer;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class SyncML {
    public static final String[] TAG_TABLE_0 = {"Add", "Alert", "Archive", "Atomic", "Chal", "Cmd", "CmdID", "CmdRef", "Copy", "Cred", "Data", "Delete", "Exec", "Final", "Get", "Item", "Lang", "LocName", "LocURI", MarshalHashtable.NAME, "MapItem", "Meta", "MsgID", "MsgRef", "NoResp", "NoResults", "Put", "Replace", "RespURI", "Results", "Search", "Sequence", "SessionID", "SftDel", "Source", "SourceRef", "Status", "Sync", "SyncBody", "SyncHdr", "SyncML", "Target", "TargetRef", "Reserved for future use", "VerDTD", "VerProto", "NumberOfChanged", "MoreData", "Field", "Filter", "Record", "FilterType", "SourceParent", "TargetParent", "Move", "Correlator"};
    public static final String[] TAG_TABLE_1 = {"Anchor", "EMI", "Format", "FreeID", "FreeMem", "Last", "Mark", "MaxMsgSize", "Mem", "MetInf", "Next", "NextNonce", "SharedMem", "Size", "Type", "Version", "MaxObjSize", "FieldLevel"};
    public static final String[] TAG_TABLE_2_DM = {"AccessType", "ACL", "Add", "b64", "bin", "bool", "chr", "CaseSense", "CIS", "Copy", "CS", "date", "DDFName", "DefaultValue", "Delete", "Description", "DDFFormat", "DFProperties", "DFTitle", "DFType", "Dynamic", "Exec", "float", "Format", "Get", "int", "Man", "MgmtTree", "MIME", "Mod", "Name", "Node", "node", "NodeName", "null", "Occurence", "One", "OneOrMore", "OneOrN", "Path", "Permanent", "Replace", "RTProperties", "Scope", "Size", "time", "Title", "TStamp", "Type", "Value", "VerDTD", "VerNo", "xml", "ZeroOrMore", "ZeroOrN", "ZeroOrOne"};

    public static WbxmlParser createDMParser() {
        WbxmlParser createParser = createParser();
        createParser.setTagTable(2, TAG_TABLE_2_DM);
        return createParser;
    }

    public static WbxmlSerializer createDMSerializer() {
        WbxmlSerializer createSerializer = createSerializer();
        createSerializer.setTagTable(2, TAG_TABLE_2_DM);
        return createSerializer;
    }

    public static WbxmlParser createParser() {
        WbxmlParser wbxmlParser = new WbxmlParser();
        wbxmlParser.setTagTable(0, TAG_TABLE_0);
        wbxmlParser.setTagTable(1, TAG_TABLE_1);
        return wbxmlParser;
    }

    public static WbxmlSerializer createSerializer() {
        WbxmlSerializer wbxmlSerializer = new WbxmlSerializer();
        wbxmlSerializer.setTagTable(0, TAG_TABLE_0);
        wbxmlSerializer.setTagTable(1, TAG_TABLE_1);
        return wbxmlSerializer;
    }
}

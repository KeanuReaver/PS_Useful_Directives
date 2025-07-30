'use strict';
define(['angular', 'jquery'], function(angular, $j) {
    return angular
        .module('psQueryModule', [])
        .factory('$psq', [function() {

            const isGuardian = window.location.href.includes("/guardian/");
            const isTeacher = window.location.href.includes("/teachers/");

            const BASE_URL = isGuardian
                ? '/guardian/psQuery/psQueryP.html?g=1'
                : isTeacher
                    ? '/teachers/psQuery/psQueryT.html?t=1'
                    : '/admin/psQuery/psQueryA.html?no-store-lp=1';

            const psQuery = function(table) {
                return new psQuery.init(table);
            };

            psQuery.maxParams = 20;

            const stockTables = {
                address: "164",
                aggstats: "046",
                agg_attendance: "167",
                agg_att_detail: "171",
                attendance: "157",
                attendancequeue: "048",
                attendance_code: "156",
                attendance_conversion: "131",
                attendance_conversion_items: "132",
                attendance_taken: "172",
                attendance_time: "158",
                att_code_code_entity: "163",
                audit_log: "170",
                autocomm: "047",
                autosend: "049",
                awsched_constraint: "152",
                awsched_preference: "155",
                batches: "028",
                bell_schedule: "133",
                bell_schedule_items: "134",
                blobs: "012",
                books: "014",
                bulletinitems: "026",
                cache_message: "178",
                calendar: "029",
                calendar_day: "051",
                cc: "004",
                classrank: "015",
                code_entity: "162",
                component: "161",
                config_group: "176",
                coursefee: "104",
                courses: "002",
                course_relationship: "151",
                creq: "038",
                customdates: "185",
                customintegers: "181",
                customreals: "182",
                customtext: "183",
                customtimes: "186",
                customvarchars: "184",
                cycle_day: "135",
                dailyattendance: "084",
                dblog: "020",
                db_object: "169",
                db_version: "187",
                demographic: "166",
                department: "136",
                dialogs: "010",
                dnldqueue: "019",
                ds: "023",
                ethnicity: "168",
                facility: "137",
                fee: "146",
                fees: "054",
                fee_balance: "148",
                fee_transaction: "147",
                fee_type: "144",
                fields: "007",
                fieldtypechangerequest: "196",
                fte: "159",
                fte_grade: "160",
                gen: "006",
                gldetail: "025",
                gradescaleitem: "090",
                gradreq: "037",
                gradreqsets: "057",
                guardians: "055",
                help: "044",
                honorroll: "034",
                log: "008",
                log2: "050",
                logins: "016",
                mimetypes: "011",
                pages: "030",
                period: "138",
                pgassignments: "092",
                pgassignmentstandards: "093",
                pgcategories: "094",
                pgcommentbank: "097",
                pgfinalgrades: "095",
                pgfinalgradessetup: "191",
                pggradescales: "192",
                pggradescalesmark: "193",
                pgincomingqueue: "040",
                pgnotification: "173",
                pgpreferences: "043",
                pgscores: "096",
                pgsections: "195",
                pgstudents: "194",
                phonelog: "027",
                postsecondary: "165",
                prefs: "009",
                program: "174",
                queue: "024",
                reenrollments: "018",
                registreq: "056",
                relationship: "189",
                repobatchsetups: "101",
                repolookuptables: "065",
                repolookuptablescontentsitems: "067",
                repolookuptablescontrecords: "068",
                repolookuptablesdefitems: "066",
                reports: "022",
                reposetups: "059",
                reposetupsitems: "060",
                reposetupsorderby: "064",
                reposetupsqueries: "063",
                reposetupsqueryitems: "062",
                reposetupsuserdata: "061",
                reposetupsuserdatadefaults: "091",
                reposetupsvariables: "083",
                robj: "036",
                room: "139",
                scheduleactivitystatus: "073",
                schedulebldsessions: "114",
                schedulebuildcourserank: "116",
                schedulebuilddiagnostics: "118",
                schedulebuildings: "071",
                schedulebuilds: "105",
                schedulecatalogs: "109",
                schedulecc: "111",
                scheduleconstraints: "110",
                schedulecoursecatalogs: "107",
                schedulecourserelationships: "078",
                scheduledays: "075",
                scheduledepartments: "069",
                schedulefacilities: "076",
                schedulehouses: "072",
                scheduleitems: "052",
                scheduleloaddiagnostics: "119",
                scheduleloadtypes: "077",
                scheduleperiods: "080",
                schedulequeue: "113",
                schedulerequests: "082",
                schedulerooms: "081",
                scheduleroomtypes: "074",
                schedulesectionmeeting: "130",
                schedulesections: "112",
                schedulesectiontypes: "079",
                scheduleteacherassignments: "106",
                scheduleterms: "108",
                schedulevalidation: "117",
                schedulevalidterms: "070",
                sched_debug: "115",
                schoolfee: "145",
                schools: "039",
                schoolstaff: "203",
                school_course: "153",
                school_course_sched_parm: "154",
                sections: "003",
                sectionscores: "100",
                sectionscoresassignments: "198",
                sectionscoresid: "197",
                section_meeting: "140",
                selections: "085",
                seqno: "058",
                server_config: "175",
                server_instance: "177",
                sif_message: "179",
                spenrollments: "041",
                standardscurrent: "098",
                stateeventqueue: "102",
                stateextract_codeconversion: "128",
                stateextract_layoutelements: "127",
                stateextract_layouts: "126",
                statesupportdata: "021",
                statetransactionqueue: "103",
                stats: "017",
                storedgrades: "031",
                studentattendancesummary: "200",
                studentrace: "201",
                students: "001",
                studentschedulingresults: "190",
                studenttest: "087",
                studenttestscore: "089",
                sys_sequence: "180",
                teacherdailyload: "199",
                teacherrace: "202",
                teachers: "005",
                termbins: "033",
                terms: "013",
                test: "086",
                testscore: "088",
                transportation: "120",
                truancies: "042",
                ucols: "035",
                unschedstudschedlink: "143",
                unschedtermdayperiodslot: "142",
                unscheduledroom: "150",
                unscheduledstudent: "141",
                unscheduledteacher: "149",
                users: "204",
                utable: "032",
                virtualfieldsdef: "122",
                virtualtablesdata: "123",
                virtualtablesdata2: "125",
                virtualtablesdata3: "129",
                virtualtablesdef: "121",
                vs: "045",
                webasmt: "124"
            };

            psQuery.prototype = {

                delete: function(dcid, callback) {
                    return this.update(dcid, 'delete', callback);
                },

                insert: function(fields, callback) {
                    return this.update(-99, fields, callback);
                },

                insertChild: function(parent, fields, callback) {
                    return this.update(parent, fields, callback);
                },

                update: function(dcid, fields, callback) {
                    const self = this;
                    let url = BASE_URL;
                    let isDelete = fields === 'delete';
                    let name_prefix, frn;
                    let parentStr, parentID;

                    if (dcid !== null && typeof dcid === 'object') {
                        parentStr = stockTables.hasOwnProperty(dcid.table)
                            ? `${dcid.table}.dcid`
                            : `${dcid.table}.${self.id_name}`;
                        parentID = dcid.id;
                        url += `&p=1&parentStr=${parentStr}&parentID=${parentID}`;
                        dcid = -99;
                    }

                    if (self.table_custom) {
                        name_prefix = isDelete
                            ? `DD-${self.table_name}.ID:${dcid}`
                            : `CF-[${self.table_name}:${dcid}]`;
                    } else {
                        frn = `${self.table_number}${dcid}`;
                        url += `&frn=${frn}`;
                        name_prefix = isDelete
                            ? `DR-${frn}`
                            : `[${self.table_number}]`;
                    }

                    if ((fields !== null && typeof fields === 'object') || isDelete) {
                        let count = 0;
                        const params = {};
                        const valuemap = [isGuardian ? 'autosendupdate' : isTeacher ? 'webasmt' : 'prim'];

                        if (isDelete) {
                            params.key1 = 1;
                            params.name1 = name_prefix;
                            valuemap.push(1);
                        } else {
                            for (const k in fields) {
                                if (fields.hasOwnProperty(k)) {
                                    count++;
                                    params[`key${count}`] = count;
                                    params[`name${count}`] = name_prefix + k;
                                    valuemap.push(fields[k]);

                                    const isDate = (typeof valuemap[count] === 'string' &&
                                                    !isNaN(new Date(valuemap[count])) &&
                                                    !isNaN(valuemap[count].charAt(0)))
                                        ? 'date' : 'notDate';

                                    if (count <= 2 && valuemap[count] && !k.startsWith('[') && !isDelete) {
                                        url += `&fieldName${count}=${k}&fieldVal${count}=${encodeURIComponent(valuemap[count])}&fieldDatatype${count}=${isDate}`;
                                    }
                                }
                            }
                        }

                        if (self.table_custom) url += '&iscustom=1';
                        if (count > psQuery.maxParams) throw 'psQuery: too many fields';

                        $j.post(encodeURI(url), params, function(retForm) {
                            const fieldData = {};
                            $j(retForm).children("input").each(function(i) {
                                fieldData[$j(this).attr("name")] = valuemap[i];
                            });
                            if (parentStr) fieldData[parentStr] = parentID;

                            url += `&table_name=${self.table_name}&id_name=${self.id_name}&z=1`;
                            
                            $j.post(encodeURI(url), fieldData, function(retID) {
                                if (typeof callback === 'function') {
                                    if (isNaN(retID)) {
                                        callback(0);
                                    } else {
                                        retID = Number(retID);
                                        if (isDelete || dcid > 0) retID = dcid;
                                        callback(retID);
                                    }
                                }
                            });
                        });
                    } else {
                        throw 'psQuery: missing parameters';
                    }
                },

                get: function(where_clause, return_fields, callback) {
                    const self = this;
                    if (isGuardian || isTeacher) {
                        throw 'psQuery.get: not supported in this portal';
                    }

                    if (!where_clause || !return_fields) throw 'psQuery: missing parameters';
                    if (!Array.isArray(return_fields)) return_fields = [return_fields];

                    const select = return_fields.concat(Array(20).fill("''")).slice(0, 20);
                    const params = {
                        table_name: self.table_name,
                        select_fields: select.join(),
                        where_clause: where_clause
                    };

                    $j.post(encodeURI(BASE_URL + '&z=1&q=1'), params, function(json) {
                        const data = JSON.parse(json);
                        data.pop(); // drop record count
                        const results = data.map(row => {
                            const r = {};
                            for (let i = 0; i < return_fields.length; i++) {
                                let field = return_fields[i];
                                const aliasIndex = field.indexOf(' AS ');
                                if (aliasIndex > -1) field = field.substring(aliasIndex + 4);
                                r[field] = row['c' + i];
                            }
                            return r;
                        });
                        callback(results);
                    });

                    return this;
                }
            };

            psQuery.init = function(table) {
                const self = this;
                self.table_custom = false;
                self.id_name = 'dcid';

                if (!isNaN(table) && Number(table) > 0) {
                    table = ('00' + Number(table)).slice(-3);
                    self.table_number = table;
                    for (const k in stockTables) {
                        if (stockTables[k] === table) {
                            self.table_name = k;
                            return;
                        }
                    }
                    throw 'psQuery: table not defined';
                } else {
                    if (!stockTables.hasOwnProperty(table)) {
                        if (table.toUpperCase().startsWith('U_')) {
                            self.table_custom = true;
                            self.table_name = table;
                            self.id_name = 'id';
                        } else {
                            throw 'psQuery: unknown table';
                        }
                    } else {
                        self.table_name = table;
                        self.table_number = stockTables[table];
                    }
                }
            };

            psQuery.init.prototype = psQuery.prototype;

            return psQuery;
        }]);
});
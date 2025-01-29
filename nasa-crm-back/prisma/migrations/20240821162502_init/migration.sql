-- CreateTable
CREATE TABLE "consultant" (
    "consultant_id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "trigram" VARCHAR(255),
    "email" VARCHAR(255),
    "active" BOOLEAN DEFAULT true,
    "emailnotification" BOOLEAN DEFAULT true,

    CONSTRAINT "consultant_pkey" PRIMARY KEY ("consultant_id")
);

-- CreateTable
CREATE TABLE "analyzed_file" (
    "application_code" VARCHAR(255),
    "analysis_date" TIMESTAMP(6),
    "file_name" VARCHAR(255),
    "file_fullname" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "application" (
    "application_id" SERIAL NOT NULL,
    "application_name" VARCHAR(255) NOT NULL,
    "application_guid" VARCHAR(255),
    "active" BOOLEAN,
    "deployed" BOOLEAN,
    "application_code" VARCHAR(255),
    "application_path" VARCHAR(255),
    "rerun" BOOLEAN DEFAULT true,
    "train_id" INTEGER DEFAULT 0,
    "inprocess" BOOLEAN DEFAULT false,
    "lastanalysis_end_date" TIMESTAMP(6),
    "lastanalysis_starting_date" TIMESTAMP(6),
    "creation_date" TIMESTAMP(6),
    "flagneedarerun" BOOLEAN
);

-- CreateTable
CREATE TABLE "application_log" (
    "application_code" TEXT,
    "log_file_path" TEXT,
    "level" TEXT,
    "text" TEXT,
    "creation_date" TIMESTAMP(6)
);

-- CreateTable
CREATE TABLE "application_objtyp" (
    "applicationcode" VARCHAR(255),
    "objtyp" VARCHAR(255),
    "numberof" INTEGER,
    "internaltypename" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "profiler_information" (
    "application_code" VARCHAR(255),
    "comp_language" VARCHAR(255),
    "comp_nb_loc" INTEGER,
    "comp_nb_bytes" INTEGER,
    "comp_nb_files" INTEGER,
    "comp_type" VARCHAR(255),
    "comp_isbinary" BOOLEAN,
    "comp_extension" VARCHAR(255),
    "comp_primary_extension" VARCHAR(255),
    "train_id" INTEGER
);

-- CreateTable
CREATE TABLE "project" (
    "project_id" SERIAL NOT NULL,
    "client_name" VARCHAR(255),
    "consultant_id" INTEGER,
    "start_date" DATE,
    "due_date" DATE,
    "description" VARCHAR(4096),
    "hubspot_deal" VARCHAR(255),
    "app_number_poc" INTEGER,
    "app_number_goal" INTEGER,
    "sow" BOOLEAN,
    "funding" VARCHAR(255),
    "expected_tech" VARCHAR(255),
    "teams_channel" VARCHAR(255),
    "infrastructure" VARCHAR(255),
    "stage_id" INTEGER NOT NULL DEFAULT 19,
    "highlight" BOOLEAN,
    "imaging" BOOLEAN,
    "client_id" INTEGER,
    "deal_size" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "server_setup" (
    "server_property" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "stage" (
    "stage_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "context" VARCHAR(255) NOT NULL,
    "executionorder" INTEGER NOT NULL,
    "display" BOOLEAN NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "stage_pkey" PRIMARY KEY ("stage_id")
);

-- CreateTable
CREATE TABLE "pivot_tag" (
    "pivot_tag_id" SERIAL NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "train_id" INTEGER NOT NULL,

    CONSTRAINT "pivot_tag_pkey" PRIMARY KEY ("pivot_tag_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "tag_id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "filename" VARCHAR(255),
    "color" VARCHAR(10),
    "type" VARCHAR(255),

    CONSTRAINT "tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "belongto" (
    "parent" VARCHAR(255),
    "child" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "pivot_project_tag" (
    "pivot_project_tag_id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "pivot_project_tag_pkey" PRIMARY KEY ("pivot_project_tag_id")
);

-- CreateTable
CREATE TABLE "client" (
    "client_id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "infocast_id" INTEGER,

    CONSTRAINT "client_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "pivot_sale_client" (
    "pivot_sale_client_id" SERIAL NOT NULL,
    "client_id" INTEGER,
    "sale_id" INTEGER,

    CONSTRAINT "pivot_sale_client_pkey" PRIMARY KEY ("pivot_sale_client_id")
);

-- CreateTable
CREATE TABLE "sale" (
    "sale_id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "trigram" VARCHAR(3),
    "email" VARCHAR(255),

    CONSTRAINT "sale_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "pivot_project_consultant" (
    "pivot_project_consultant_id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "consultant_id" INTEGER NOT NULL,

    CONSTRAINT "pivot_project_consultant_pkey" PRIMARY KEY ("pivot_project_consultant_id")
);

-- CreateTable
CREATE TABLE "profiler_framework_information" (
    "application_code" VARCHAR(255),
    "framework_type" VARCHAR(255),
    "framework_name" VARCHAR(255),
    "train_id" INTEGER
);

-- CreateTable
CREATE TABLE "profiler_graphviz" (
    "application_code" VARCHAR(255),
    "graphviz" TEXT,
    "train_id" INTEGER
);

-- CreateTable
CREATE TABLE "infraconfig" (
    "infraconfig_id" SERIAL NOT NULL,
    "highlighturl" VARCHAR(255),
    "highlightlogin" VARCHAR(255),
    "highlightpassword" VARCHAR(255),
    "neo4jlogin" VARCHAR(255),
    "neo4jpassword" VARCHAR(255),
    "aiprestserver" VARCHAR(255),
    "aiprestlogin" VARCHAR(255),
    "aiprestpassword" VARCHAR(255),
    "postgreslogin" VARCHAR(255),
    "postgrespassword" VARCHAR(255),
    "imagingrestlogin" VARCHAR(255),
    "imagingrestpassword" VARCHAR(255),
    "project_id" INTEGER,
    "neo4jserver" VARCHAR(255),
    "postgresserver" VARCHAR(255),
    "imagingrestserver" VARCHAR(255),
    "vm_url" TEXT,
    "neo4jport" INTEGER,
    "postgresport" INTEGER,
    "imagingrestport" INTEGER,
    "aiprestport" INTEGER,
    "highlightinstance" INTEGER,

    CONSTRAINT "infraconfig_pkey" PRIMARY KEY ("infraconfig_id")
);

-- CreateTable
CREATE TABLE "sourcecode" (
    "sourcecode_id" SERIAL NOT NULL,
    "originefilename" VARCHAR(255),
    "filename" VARCHAR(255),
    "fileextension" VARCHAR(255),
    "fileoriginpath" VARCHAR(255),
    "filecurrentpath" VARCHAR(255),
    "filecreationdate" TIMESTAMP(6) DEFAULT CURRENT_DATE
);

-- CreateTable
CREATE TABLE "train" (
    "train_id" SERIAL NOT NULL,
    "sourcecode_id" INTEGER,
    "application_code" VARCHAR(255),
    "application_name" VARCHAR(255),
    "application_displayname" VARCHAR(255),
    "project_id" INTEGER,
    "consultant_id" INTEGER,
    "stage_id" INTEGER NOT NULL DEFAULT 2,
    "creationdate" TIMESTAMP(6) DEFAULT CURRENT_DATE,
    "comment" VARCHAR(255),
    "portfolio" BOOLEAN DEFAULT false,
    "runningflag" INTEGER DEFAULT 0,

    CONSTRAINT "train_pkey" PRIMARY KEY ("train_id")
);

-- CreateTable
CREATE TABLE "trainlog" (
    "task_id" SERIAL NOT NULL,
    "train_id" VARCHAR(255),
    "task_type" VARCHAR(255),
    "task_start_date" TIMESTAMP(6),
    "task_end_date" TIMESTAMP(6),

    CONSTRAINT "trainlog_pkey" PRIMARY KEY ("task_id")
);

-- CreateIndex
CREATE INDEX "fki_project" ON "pivot_project_tag"("project_id");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "client" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pivot_tag" ADD CONSTRAINT "tag" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pivot_tag" ADD CONSTRAINT "train" FOREIGN KEY ("train_id") REFERENCES "train"("train_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pivot_project_tag" ADD CONSTRAINT "project" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pivot_project_tag" ADD CONSTRAINT "tag" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pivot_project_consultant" ADD CONSTRAINT "consultant" FOREIGN KEY ("consultant_id") REFERENCES "consultant"("consultant_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pivot_project_consultant" ADD CONSTRAINT "project" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "infraconfig" ADD CONSTRAINT "project_id" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "train" ADD CONSTRAINT "consultant" FOREIGN KEY ("consultant_id") REFERENCES "consultant"("consultant_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "train" ADD CONSTRAINT "project" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE SET NULL ON UPDATE NO ACTION;

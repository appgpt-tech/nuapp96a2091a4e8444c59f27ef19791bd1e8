import {
  Datagrid,
  List,
  EditButton,
  Edit,
  SimpleForm,
  Create,
  SelectColumnsButton,
  DatagridConfigurable,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  //Field controls
  BooleanField,
  DateField,
  EmailField,
  ImageField,
  NumberField,
  ReferenceField,
  TextField,
  UrlField,
  //Input controls
  BooleanInput,
  DateInput,
  //EmailInput,
  ImageInput,
  NumberInput,
  ReferenceInput,
  TextInput,
  //UrlInput,
} from "react-admin";
import { useRecordContext } from "react-admin";
const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
        <SelectColumnsButton />
    </TopToolbar>
);
const AppsTitle = () => {
  const record = useRecordContext();
  return <span>Apps {record ? `"${ record.Appname }"` : ""}</span>;
};

export const AppsList = () => (
      <List actions={<ListActions  />} filters={ResourceFilters} >
        <DatagridConfigurable>
          <TextField source="Appname" />
<TextField source="Developer" />
<TextField source="Category" />
<TextField source="Numberofentities" />
<NumberField source="Id" /><EditButton />

        </DatagridConfigurable>
      </List>
      );

export const AppsEdit = () => (
                    <Edit title={<AppsTitle />}>
                      <SimpleForm>
                          <TextInput source="Appname"   />
<TextInput source="Developer"   />
<TextInput source="Category"   />
<TextInput source="Numberofentities"   />
<NumberInput source="Id"   disabled/>
                      </SimpleForm>
                    </Edit>
                  );

export const AppsCreate = () => (
                                  <Create>
                                    <SimpleForm>
                                        <TextInput source="Appname"   />
<TextInput source="Developer"   />
<TextInput source="Category"   />
<TextInput source="Numberofentities"   />
<NumberInput source="Id"   disabled/>
                                    </SimpleForm>
                                  </Create>
                                );

const ResourceFilters = [
      <TextInput source="q" label="Search" alwaysOn />,
,
,
,
,

    ];



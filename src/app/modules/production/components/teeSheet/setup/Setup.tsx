import { Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../../../../_metronic/layout/core";
import { CourseSetup } from "./CourseSetup";
  let accountBreadCrumbs: any = [];

export const Setup: any = () => {

  return (
    <Routes>
        <Route
          path="course-setup"
          element={
            <>
                <PageTitle breadcrumbs={accountBreadCrumbs}>Course Setup</PageTitle>
                <CourseSetup />
            </>
          }
        />
    </Routes>
  );
}

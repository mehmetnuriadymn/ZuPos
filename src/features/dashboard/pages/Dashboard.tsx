import MainGrid from "../components/MainGrid";
import PageContainer from "../../../shared/layout/PageContainer";

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard" showBreadcrumbs={false}>
      <MainGrid />
    </PageContainer>
  );
}
